import { Command } from ".";
import { JsonFileStorage } from './crud.file';
import puppeteer from 'puppeteer';
const specStorage = new JsonFileStorage('spec.json');

export class SpecCommand extends Command {
    async execute(source) {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        for (const key of references) {
            const { brand, cellphones } = key;
            for (const keyRef of cellphones) {
                const { details, path, name, image } = keyRef;
                await page.goto(`${mainPage}/${path}`);
                await waitForSelectorWithRetry(page, "#specs-list");
               
        
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
                await browser.close();
                console.log(spec);
                specStorage.map(async (settings, id) => {
                    await storage.create({ ...settings, id });
                });
            }
        }
    }
    get usage() {
        return "<spec>"
    }
    get description() {
        return "Execute a shell spec"
    }
}