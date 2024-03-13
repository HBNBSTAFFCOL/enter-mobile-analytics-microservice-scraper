import { Command } from "./index.mjs";
import { JsonFileStorage } from './crud.file.mjs';
import puppeteer from 'puppeteer';
import { config } from "./config.mjs";
const specStorage = new JsonFileStorage('spec.json');

export class SpecCommand extends Command {
    async execute(source) {
        const spec = [];
        /*
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        */
        const pathReferences = await config.referencesStorage.read();

        for (const key of pathReferences) {
            const { brand, cellphones } = key;

            const browser = await puppeteer.launch({
                headless: false,
            });
            const page = await browser.newPage();
            page.setDefaultNavigationTimeout(0);

            for (const keyRef of cellphones) {
                const { details, path, name, image } = keyRef;
                await page.goto(`${config.baseURL}/${path}`);
                page.waitForSelector("#specs-list");
               
                const data = await page.$$eval('#specs-list > table', (data) => {
                    return data.map($characteristic => {
                        const $HeadTable = $characteristic.querySelector("tbody > tr > th");

                        const atributes = $characteristic.querySelectorAll("tbody > tr");
                        const charac = Array.from(atributes).map($attribute => {
                            const $Attributes = $attribute.querySelector("tbody > tr > td.ttl > a");
                            const $Info = $attribute.querySelector("tbody > tr > td.nfo");

                            const toText = (element) => element && element.innerText.trim();

                            return {
                                attributes: toText($Attributes),
                                characteristics: toText($Info),
                            };
                        });/*$characteristic.querySelector("tbody > tr > td.ttl > a");*/
                        /*const $Data = $characteristic.querySelector("tbody > tr > td.nfo");*/
        
                        const toText = (element) => element && element.innerText.trim();
            
                        return {
                            headTable: toText($HeadTable),
                            attributes: charac,
                            /*characteristics: toText($Data),*/
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
            }
            await browser.close();
            await new Promise(r => setTimeout(r, 3000));
        }
        /*await browser.close();*/
        console.log(spec);
                for (const specs of spec){
                    await specStorage.create(specs);
                }
    }
    get usage() {
        return "<spec>"
    }
    get description() {
        return "Execute a shell spec"
    }
}