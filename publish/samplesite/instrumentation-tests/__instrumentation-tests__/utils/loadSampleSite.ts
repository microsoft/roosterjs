import { Page } from 'puppeteer';
export default async function loadSampleSite(): Promise<Page> {
    // TODO extend global definition in this dir
    const page: Page = await (global as any).__BROWSER__.newPage();
    await page.goto('http://localhost:9090/');
    return page;
}