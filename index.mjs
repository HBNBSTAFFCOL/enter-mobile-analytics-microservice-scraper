import { MyCLI } from './commands/index.mjs';
import { BrandCommand } from './commands/brands.mjs';
import { ReferencesCommand } from './commands/references.mjs';
import { SpecCommand } from './commands/spec.mjs';

/*
// Example usage:
const referencesStorage = new JsonFileStorage('references.json');
const specStorage = new JsonFileStorage('spec.json');
*/


// Iniciar la aplicación CLI con los comandos
new MyCLI({
    brand: new BrandCommand(),
    reference: new ReferencesCommand(),
    spec: new SpecCommand(),
});

/*
(async () => {
    // Create operation
    await storage.create({ id: 1, name: "Example" });

    // Read operation
    const allData = await storage.read();
    console.log(allData);

    // Update operation
    await storage.update({ id: 1, name: "Updated Example" });

    // Delete operation
    await storage.delete(1);
})();
*/
/*
//Get the brands
async function getBrands(urlPage) {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto(urlPage);
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
        await browser.close();
        console.log(brands);
        resolve(brands);
}
*/
/*
// Function to wait for selector with retry mechanism
async function waitForSelectorWithRetry(page, selector, timeout = 10000, maxRetries = 3) {
    let attempts = 0;
    while (attempts < maxRetries) {
        try {
            await page.waitForSelector(selector, { timeout });
            return; // Selector found, exit function
        } catch (error) {
            attempts++;
            console.error(`Attempt ${attempts}: Timeout waiting for ${selector}`);
            // Optionally, add a delay before retrying to avoid overwhelming the server
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 2 seconds before retrying
        }
    }
    throw new Error(`Exceeded maximum number of retries (${maxRetries}) waiting for ${selector}`);
}
*/

/*
//Main variables
const references = [];
const spec = [];
*/

/*
// Open the installed Chromium. We use headless: false
// to be able to inspect the browser window.
const browser = await puppeteer.launch({
    headless: false,
    timeout: 60000,
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
*/
/*
// capture of brand the references and path
for (const key of brands) {
    const { path, name } = key;

    await page.goto(`${mainPage}/${path}`);
    await waitForSelectorWithRetry(page, "#review-body > div");
    //page.waitForSelector("#review-body > div");

    const data = await page.$$eval('#review-body > div > ul > li', (data) => {
        return data.map($reference => {
            const $link = $reference.querySelector("a");
            const $Details = $reference.querySelector("img");
            const $NameReference = $reference.querySelector("a > strong > span"); 
    
            const toTitle = (element) => element && element.getAttribute('title');
            const getPath = (element) => element && element.getAttribute('href').trim();
            const toText = (element) => element && element.innerText.trim();
	        const getImage = (element) => element && element.getAttribute('src');

            return {
                details: toTitle($Details),
                path: getPath($link),
                name: toText($NameReference),
	        image: getImage($Details),
            };
        });
    });
    references.push({
            brand: name,            
            cellphones: data,
    });
}
*/
/*
//Capture each references spec
for (const key of references) {
    const { brand, cellphones } = key;
    for (const keyRef of cellphones) {
        const { details, path, name, image } = keyRef;
        await page.goto(`${mainPage}/${path}`);
        await waitForSelectorWithRetry(page, "#specs-list");
        //page.waitForSelector("#specs-list");

        const data = await page.$$eval('#specs-list > table', (data) => {
            return data.map($characteristic => {
                const $HeadTable = $characteristic.querySelector("tbody > tr.tr-hover > th");
                const $Attribute = $characteristic.querySelector("tbody > tr.tr-hover > td.ttl > a");
                const $Data = $characteristic.querySelector("tbody > tr > td.nfo");

                const toText = (element) => element && element.innerText.trim();
    
                return {
                    headTable: toText($HeadTable),
                    attribute: toText($Attribute),
                    characteristics: toText($Data),
                };
            });
        });
        spec.push({
            brand: brand,
            reference: name,            
            spec: data,
            detail: details,
            image: image,
        });
        await new Promise(r => setTimeout(r, 1000));
    }
}
*/
/*
const brands = getBrands('https://www.gsmarena.com/');
console.log(brands);
*/
/*
// Turn off the browser to clean up after ourselves.
await browser.close();
*/

/*
//output scrap information
console.log(brands);
console.log(references);
console.log(spec[0]);
*/