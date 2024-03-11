import { Command } from ".";
import { JsonFileStorage } from './crud.file';
import puppeteer from 'puppeteer';
const referencesStorage = new JsonFileStorage('references.json');

export class ReferencesCommand extends Command {
    async execute(source) {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        for (const key of brands) {
            const { path, name } = key;
        
            await page.goto(`${mainPage}/${path}`);
            await waitForSelectorWithRetry(page, "#review-body > div");
        
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
            await browser.close();
            console.log(references);
            referencesStorage.map(async (settings, id) => {
                await storage.create({ ...settings, id });
            });
        }
    }
    get usage() {
        return "<reference>"
    }
    get description() {
        return "Execute a shell reference"
    }
}