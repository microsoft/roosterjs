import { Page } from 'puppeteer';
export default async function ensureSidePaneOpen(page: Page) {
    await page.waitForSelector('.side-pane-toggle');
    if (await page.evaluate(() => document.querySelector('.side-pane-toggle.closed') != null)) {
        page.click('.side-pane-toggle.closed');
    } else {
        console.log('no closed toggle');
    }
    await page.waitForSelector('.main-pane');
}
