// scraping/scraping.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import asyncHandler from "express-async-handler";
import { prisma } from '../config/db.js';


puppeteer.use(StealthPlugin());


const is_find_passport = asyncHandler(async(name_passport) => {
    const isFind = await prisma.passport.findUnique({
        where: {
            name_passport
        }
    });
    if (isFind) return isFind
    return {}
});

async function start_scraping () {    
    let obj = {}

    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
            '--disable-blink-features=AutomationControlled' // Key for UC mode
        ]
    });
    const page = await browser.newPage();

    const cdp = await page.target().createCDPSession();

    // Example: Use CDP to bypass touch/platform detection
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    `
    });

    await page.goto(process.env.SCRAPING_URL, { waitUntil: "networkidle0" });

    const total = await page.$$eval("div.passimg", els => els.length);

    for (let i = 0; i < total; i++) {
        await page.goto(process.env.SCRAPING_URL, { waitUntil: "networkidle0" });

        const divElements = await page.$$("div.passimg");
        await page.evaluate(el => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, divElements[i]);

        await new Promise(r => setTimeout(r, 1000))
        
        await divElements[i].click();

        try {

            const link = await page.$eval("a.psprt-view-dashboard", link => link.href);
            await page.goto(link, { waitUntil: "networkidle0" })
            
            const name = await page.$eval(
                '#psprt-dashboard > div:nth-of-type(1) > div.col-md-10.text-left.psprt-dashboard-title.text-uppercase.text-white > h1 > b',
                title => title.innerText
            );

            const cover_src = await page.$eval(
                "#psprt-dashboard > div:nth-of-type(2) > div.col-xs-12.col-sm-7.col-md-8 > div:nth-of-type(1) > div.col-xs-4.col-sm-5.col-md-3.text-center.psprt-dashboard-cover > div.image-container > img",
                img => img.src
            );

            obj["name_passport"] = name.trim();
            obj["cover"] = cover_src;

            const is_find = await is_find_passport(obj["name_passport"]);
            let passportId;
            if (is_find) {
                const update = await prisma.passport.update({
                    where: {
                        id: is_find.id,
                    },
                    data: {
                        cover: obj["cover"],
                    },
                });

                passportId = update.id;

                await prisma.visaRequirement.deleteMany({
                    where: {
                        passportId
                    }
                });

            } else {
                const new_passport = await prisma.passport.create({
                    data: obj,
                });
                passportId = new_passport.id;
            }
            const visa_requirements = await page.evaluate((passportId) => {
                const list = [];
                const tbody = document.querySelector("tbody");

                const tr = tbody.querySelectorAll(".show-tr");
                tr.forEach((el, _) => {
                    const icon = el.querySelector("span").getAttribute("class");
                    const name = el.querySelector("a").innerText;
                    const visa_type = el.querySelector(".vrules").innerText;
                    const div_color = el.querySelector("td.text-center").classList[0];

                    const computedStyle = getComputedStyle(
                        el.querySelector(`.${div_color}`)
                    );
                    const color = computedStyle.backgroundColor;

                    list.push({
                        passportId,
                        icon, name, visa_type, color
                    });
                });

                return list
            }, passportId);

            await prisma.visaRequirement.createMany({
                data: visa_requirements
            });
        } catch (error) {
            console.log("CRASH", error);
            await browser.close();
        } finally {
            obj = {}
        }
    }

    await new Promise(r => setTimeout(r, 5000))

    await browser.close();
}

if (process.env.SCRAPE_MODE)
    start_scraping();

export {
    start_scraping
};