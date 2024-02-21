import puppeteer from 'puppeteer';

// Open the installed Chromium. We use headless: false
// to be able to inspect the browser window.
const browser = await puppeteer.launch({
    headless: false
});

// Open a new page / tab in the browser.
const page = await browser.newPage();
page.setDefaultNavigationTimeout(0);

// Tell the tab to navigate to the mobile phone page.
await page.goto('https://www.gsmarena.com/');

page.waitForSelector("#body > aside > div.brandmenu-v2.light.l-box.clearfix");

const brands = await page.$$eval('#body > aside > div.brandmenu-v2.light.l-box.clearfix > ul > li', (brands) => {
    return brands.map($brand => {
        const $link = $brand.querySelector("a");

        const toText = (element) => element && element.innerText.trim();
        const getPath = (element) => element && element.getAttribute('href').trim();

        return {
            name: toText($link),
            path: getPath($link),
        };
    });
});

console.log(brands);
// Turn off the browser to clean up after ourselves.
await browser.close();
