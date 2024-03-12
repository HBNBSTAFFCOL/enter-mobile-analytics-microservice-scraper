import { Command } from "./index.mjs";
import puppeteer from 'puppeteer';
import { config } from "./config.mjs";

export class ReferencesCommand extends Command {
    async execute(source/*start, end*/) {
        const references = [];
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        const pathBrands = await config.brandsStorage.read();

        for (const key of pathBrands) {
            const { path, name } = key;
        
            await page.goto(`${config.baseURL}/${path}`);
            page.waitForSelector("#review-body > div");
        
            const data = await page.$$eval('#review-body > div > ul > li', (data) => {
                const slice = data.slice(0, 1/*start, end*/);
                return slice.map($reference => {
                    const $link = $reference.querySelector("a");
                    const $Details = $reference.querySelector("img");
                    const $NameReference = $reference.querySelector("a > strong > span"); 
            
                    const toTitle = (element) => element && element.getAttribute('title');
                    const getPath = (element) => element && element.getAttribute('href').trim();
                    const toText = (element) => element && element.innerText.trim();
                    const getImage = (element) => element && element.getAttribute('src');
        
                    return {
                        id: toText($NameReference),
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
        console.log(references);
            for (const reference of references){
                await config.referencesStorage.create(reference);
            }
        await browser.close();
    }
    get usage() {
        return "<reference>"
    }
    get description() {
        return "Execute a shell reference"
    }
}