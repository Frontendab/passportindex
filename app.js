// const puppeteer = require('puppeteer');

// async function playwrightTest() {
//   // let obj = {}
//   // let arr = []

//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto("https://www.passportindex.org");
  
//   // const html = await page.content()

//   // const $ = cheerio.load(html)

//   // async function get_passports() {
//   //   const elements = await page.locator('.passimg img');
    
//   //   await elements.first().click()

//   //   const center_block = await page.locator(".center-block td .psprt-view-dashboard")
//   //   const link = await center_block.first().getAttribute("href")

//   //   await page.goto(link, {waitUntil: "networkidle"})

//   //   await page.waitForTimeout(Math.floor(Math.random() * 4000 + 1000));

//   //   // const count = await elements.count();
    
//   //   // for (let i = 0; i < count; i++) {
//   //   //   await elements.nth(i).click();

//   //   //   const elements = page.locator('.passimg img');
//   //   // }
//   // }

//   // await get_passports()

//   // await page.waitForTimeout(2000)`

//   await browser.close();
// }

// playwrightTest();


const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.freecodecamp.org/');

    await browser.close();
})();