import { Page } from 'puppeteer';
export default async function focusEditor(page: Page) {
    await page.waitForSelector('[contenteditable="true"]');
    return await page.focus('[contenteditable="true"]');
}