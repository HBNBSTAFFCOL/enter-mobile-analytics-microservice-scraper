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


// capture of brand the references and path

const data = [];

//for (const key of brands) {
    const key = brands[0];
    //const { path, name } = key;
    const path = key.path;
    const name = key.name;
    await page.goto(`${mainPage}/${path}`);
    page.waitForSelector("#review-body > div");

    const references = await page.$$eval('#review-body > div > ul > li', (references) => {
        return references.map($reference => {
            const $link = $reference.querySelector("a");
            const $Details = $reference.querySelector("img");
            const $NameReference = $reference.querySelector("a > strong > span"); 
    
            const toTitle = (element) => element && element.getAttribute('title');
            const getPath = (element) => element && element.getAttribute('href').trim();
            const toText = (element) => element && element.innerText.trim();
    
            return {
                details: toTitle($Details),
                path: getPath($link),
                name: toText($NameReference),
            };
        });
    });
    data.push({
            brand: name,            
            cellphones: references,
    });
//}

//Capture of references the caracteristics
/*
const attributes = [];

for (const key of data) {
    const { brand, cellphones } = key;
    for (const keyRef of cellphones) {
        const { details, path, name } = keyRef;
        await page.goto(`${mainPage}/${path}`);
        page.waitForSelector("#specs-list");

        const characteristics = await page.$$eval('#specs-list > table', (characteristics) => {
            return characteristics.map($characteristic => {
                const $HeadTable = $characteristic.querySelector("tbody > tr.tr-hover > th");
                const $Attribute = $characteristic.querySelector("tbody > tr.tr-hover > td.ttl > a");
                const $Data = $characteristic.querySelector("tbody > tr > td.nfo");

                const toText = (element) => element && element.innerText.trim();
    
                return {
                    headTable: toText($HeadTable),
                    attribute: toText($Attribute),
                    data: toText($Data),
                };
            });
        });
        attributes.push({
            brand: brand,
            reference: name,            
            characteristics: characteristics,
            detail: details,
        });
    }
}
*/
//output scrap information
console.log(brands);
console.log(data[0]);
//console.log(attributes[0]);

// Turn off the browser to clean up after ourselves.
await browser.close();
