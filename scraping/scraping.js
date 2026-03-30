const puppeteer = require('puppeteer-extra');
const StealthPlugin = require("puppeteer-extra-plugin-stealth")

const Passport = require("../models/passports.model");
const asyncHandler = require("express-async-handler");


puppeteer.use(StealthPlugin());


const is_find_passport = asyncHandler(async(name_passport) => {
    const isFind = await Passport.findOne({name_passport});
    if (isFind) return true
    return false
});

const save_content = asyncHandler(async(passport) => {
    const is_find = await is_find_passport(passport.name_passport);

    if (is_find)
        return ;

    const new_passport = await Passport(passport);
    await new_passport.save();
});


async function start_scraping () {
    let obj = {}
    let passports_info = []

    const browser = await puppeteer.launch({
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

    await page.goto("https://www.passportindex.org", { waitUntil: "networkidle0" });

    const total = await page.$$eval("div.passimg", els => els.length);
    const count_passports = await Passport.countDocuments({});
    if (count_passports >= total) return;
    const diff = total - count_passports;
    const start = total - diff;

    for (let i = start; i < total; i++) {
        await page.goto("https://www.passportindex.org", { waitUntil: "networkidle0" });

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

            const visa_requirements = await page.evaluate(() => {
                const list = [];
                const tbody = document.querySelector("tbody");

                const tr = tbody.querySelectorAll(".show-tr");
                tr.forEach(async (el, _) => {
                    const icon = el.querySelector("span").getAttribute("class");
                    const name = el.querySelector("a").innerText;
                    const visa_type = el.querySelector(".vrules").innerText;
                    const div_color = el.querySelector("td.text-center").classList[0];

                    const computedStyle = getComputedStyle(
                        el.querySelector(`.${div_color}`)
                    );
                    const color = computedStyle.backgroundColor;

                    list.push({
                        icon, name, visa_type, color
                    });
                });

                return list
            });

            obj["visa_requirements"] = visa_requirements

            passports_info.push(obj)

        } catch (error) {
            console.log("Catch: Render again...");
        } finally {
            save_content(obj);
            obj = {}
        }
    }

    await new Promise(r => setTimeout(r, 5000))

    await browser.close();
}

module.exports = {
    start_scraping
}