import puppeteer from 'puppeteer';

// Open the installed Chromium. We use headless: false
// to be able to inspect the browser window.
const browser = await puppeteer.launch({
    headless: false
});

// Open a new page / tab in the browser.
const page = await browser.newPage();
page.setDefaultNavigationTimeout(0);

// URL page to scrap data
const mainPage = 'https://www.gsmarena.com/';

// Tell the tab to navigate to the mobile phone page.
await page.goto(mainPage);

// capture of brand and the path
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

//console.log(brands);
// test to get the phat from de variable "brand"

// capture of brand types and path

//console.log(brands);
const data = [];

for (const key of brands) {
    const { path, name } = key;
    await page.goto(`${mainPage}/${path}`);
    page.waitForSelector("#review-body > div");

    const references = await page.$$eval('#review-body > div > ul > li', (references) => {
        return references.map($reference => {
            const $link = $reference.querySelector("a");
    
            const toText = (element) => element && element.title.trim();
            const getPath = (element) => element && element.getAttribute('href').trim();
    
            return {
                details: toText($link),
                path: getPath($link),
            };
        });
    });
    data.push({
            celulares: references,
            marca: name,
        });
}

console.log(data)
// Turn off the browser to clean up after ourselves.
await browser.close();
