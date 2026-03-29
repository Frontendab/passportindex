const puppeteer = require('puppeteer-extra');
const StealthPlugin = require("puppeteer-extra-plugin-stealth")
const cheerio = require("cheerio")

puppeteer.use(StealthPlugin());

(async () => {
  let obj = {}
  let passports_info = []

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled' // Key for UC mode
    ]
  });
  const page = await browser.newPage();
  const html = await page.content();
  const get = cheerio.load(html)

  const cdp = await page.target().createCDPSession();

  // Example: Use CDP to bypass touch/platform detection
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    `
  });

  await page.goto("https://www.passportindex.org", { waitUntil: "networkidle0" });

  const divElements = await page.$$("div.passimg");

  if (divElements.length > 0) {

    await divElements[0].click();

    try {
      const name = await page.$eval('#psprt-cname', title => title.innerText);
      const cover_src = await page.$eval("#psprt-cover", img => img.src);

      obj["name_passport"] = name.trim();
      obj["cover"] = cover_src;

      if (obj.name_passport && obj.cover) {
        const link = await page.$eval("a.psprt-view-dashboard", link => link.href);
        await page.goto(link, { waitUntil: "networkidle0" })

        const html = await page.content();
        const get = cheerio.load(html)

        // TODO: I have to store visa requirements correctly
        const visa_requirements = await get("table.psprt-dashboard-table tbody .show-tr")
        .each((i, el) => {
          const visa_requirements = []
          const flag = get(el).find("span");
          const country_name = get(el).find("a").text().trim();

          visa_requirements.push({
            flag, country_name
          });
          return visa_requirements
        });

        obj["visa_requirements"] = visa_requirements

      } else {
        console.log("NAME AND COVER_SRC IS NOT FULL!");
      }
    } catch (error) {
      console.log("Catch: Render again...");
    }

    passports_info.push(obj)
  }

  console.log(passports_info);

  await new Promise(r => setTimeout(r, 5000))

  await browser.close();
})();