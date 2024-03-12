import { Command } from "./index.mjs";
import puppeteer from 'puppeteer';
import { config } from "./config.mjs";

export class BrandCommand extends Command {
    async execute(source) {
 const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.goto(config.baseURL);
        page.waitForSelector("#body > aside > div.brandmenu-v2.light.l-box.clearfix");

        const brands = await page.$$eval('#body > aside > div.brandmenu-v2.light.l-box.clearfix > ul > li', (brands) => {
            const slice = brands.slice(0, 1/*start, end*/);
            return slice.map($brand => {
                const $link = $brand.querySelector("a");

                const toText = (element) => element && element.innerText.trim();
                const getPath = (element) => element && element.getAttribute('href').trim();

                return {
                    id: toText($link),
                    name: toText($link),
                    path: getPath($link),
                };
            });
        });
        await browser.close();
        console.log(brands);
        for (const brand of brands){
            await config.brandsStorage.create(brand);
        }

    }
    get usage() {
        return "<brand>"
    }
    get description() {
        return "Execute a shell brand"
    }
}