import loadSampleSite from './utils/loadSampleSite';
import focusEditor from './utils/focusEditor';
import { Page } from 'puppeteer';

describe('Editor', () => {
    let page: Page = null
    beforeEach(async () => {
        page = await loadSampleSite();
    })

    afterEach(async () => {
        await page.close();
    })

    it('Should convert <3 to a heart in the default configuration', async () => {
        // Arrange
        await focusEditor(page);

        // Act
        await page.keyboard.type('<3');

        // Assert
        const content = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content).toEqual("❤️")
    });

    it('Should be able to delete unicode multipart emoji after autocomplete', async () => {
        // Arrange
        await focusEditor(page);

        // Act
        await page.keyboard.type('<3');
        await page.keyboard.press('Backspace');

        // Assert
        const content = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content).toEqual("")
    });

    it('Should undo to the raw text before the autocomplete', async () => {
        // Arrange
        await focusEditor(page);
        await page.keyboard.type('<3');
        const preconditionContent = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(preconditionContent).toEqual("❤️");

        // Act
        await page.keyboard.down('Ctrl');
        await page.keyboard.press('z');
        await page.keyboard.up('Ctrl');

        // Assert
        const content = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content).toEqual("<3");
    });
});
