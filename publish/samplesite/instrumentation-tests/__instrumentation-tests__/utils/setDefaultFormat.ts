import ensureSidePaneOpen from './ensureSidePaneOpen';
import { Page } from 'puppeteer';
export default async function setDefaultFormat(
    page: Page,
    format: { italic?: boolean; underline?: boolean; bold?: boolean }
) {
    await ensureSidePaneOpen(page);

    const currentFormat = await page.evaluate(() => ({
        italic: (document.getElementById('italic') as HTMLInputElement).checked,
        underline: (document.getElementById('underline') as HTMLInputElement).checked,
        bold: (document.getElementById('bold') as HTMLInputElement).checked,
    }));

    if (format.bold !== undefined && currentFormat.bold != format.bold) {
        await ensureDefaultFormatVisible(page);
        await page.click('#bold');
    }

    if (format.italic !== undefined && currentFormat.italic != format.italic) {
        await ensureDefaultFormatVisible(page);
        await page.click('#italic');
    }

    if (format.underline !== undefined && currentFormat.underline != format.underline) {
        await ensureDefaultFormatVisible(page);
        await page.click('#underline');
    }
}

async function ensureDefaultFormatVisible(page: Page): Promise<void> {
    const editorOptions = (await page.$x("//*[contains(text(), 'Editor Options')]"))[0];
    await editorOptions.click();
    const defaultFormat = (await page.$x("//*[contains(text(), 'Default Format')]"))[0];
    const parentDetails = await defaultFormat.$x('ancestor::details');
    const isOpen = (await parentDetails[0].$x('@open')).length != 0;
    if (!isOpen) {
        await defaultFormat.click();
    }
}
