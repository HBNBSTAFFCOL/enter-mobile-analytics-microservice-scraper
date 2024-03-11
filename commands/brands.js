import { Command } from ".";
import { JsonFileStorage } from './crud.file';
import puppeteer from 'puppeteer';
const brandsStorage = new JsonFileStorage('brands.json');

export class BrandCommand extends Command {
    async execute(source) {
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
        brandsStorage.map(async (settings, id) => {
            await storage.create({ ...settings, id });
        });


    }
    get usage() {
        return "<brand>"
    }
    get description() {
        return "Execute a shell brand"
    }
}