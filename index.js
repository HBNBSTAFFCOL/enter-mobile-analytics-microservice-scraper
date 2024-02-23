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
/*
async function extractData (pathPage, selector, pathData, details = false) {
    page.setDefaultNavigationTimeout(0);
    // Tell the tab to navigate to the page.
    await page.goto(pathPage);
    // Go to the selector
    page.waitForSelector(selector);

    return await page.$$eval(pathData, (info) => {
        return info.map($data => {
            const $link = $data.querySelector("a");
    
            const toText = (element) => element && element.innerText.trim();
            const getPath = (element) => element && element.getAttribute('href').trim();
            if (details === true) {
             const toDetails = (element) => element && element.title.trim();
             return {
                details: toDetails($link),
                path: getPath($link), 
             }
            }

            return {
                name: toText($link),
                path: getPath($link),
            };
        });
    });     
}

const brands = extractData(mainPage, "#body > aside > div.brandmenu-v2.light.l-box.clearfix", '#body > aside > div.brandmenu-v2.light.l-box.clearfix > ul > li');

const data = [];

for (const key of brands) {
    const { path, name } = key;
    const references = extractData(`${mainPage}/${path}`, "#review-body > div", '#review-body > div > ul > li', true);
    data.push({
        celulares: references,
        marca: name,
    });
}
*/

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


// capture of brand references and path
const data = [];

for (const key of brands) {
    const { path, name } = key;
    await page.goto(`${mainPage}/${path}`);
    page.waitForSelector("#review-body > div");

    const references = await page.$$eval('#review-body > div > ul > li', (references) => {
        return references.map($reference => {
            const $link = $reference.querySelector("a");
            const $gDetails = $reference.querySelector("img"); 
    
            const toText = (element) => element && element.getAttribute('title');
            const getPath = (element) => element && element.getAttribute('href').trim();
    
            return {
                details: toText($gDetails),
                path: getPath($link),
            };
        });
    });
    data.push({
            marca: name,            
            celulares: references,
    });
}

console.log(data[0]);
// Turn off the browser to clean up after ourselves.
// console.log(brands);
await browser.close();
