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
        const content: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content).toEqual("❤️")
    });

    it('Should be able to delete unicode multipart emoji after autocomplete', async () => {
        // Arrange
        await focusEditor(page);

        // Act
        await page.keyboard.type('<3');
        await page.keyboard.press('Backspace');

        // Assert
        const content: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content.trim()).toEqual("")
    });

    it('Should undo to the raw text before the autocomplete', async () => {
        // Arrange
        await focusEditor(page);
        await page.keyboard.type('<3');
        const preconditionContent: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(preconditionContent).toEqual("❤️");

        // Act
        await page.keyboard.down('Control');
        await page.keyboard.press('z');
        await page.keyboard.up('Control');

        // Assert
        const content: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(content).toEqual("<3");
    });

    it('Should autocomplete replacements with spaces in them', async () => {
        // Arrange
        await page.evaluate(() => (window as any).editorPlugins.customReplace.updateReplacements([{
            sourceString: 'this is a source string with spaces',
            replacementHTML: '<_<',
            matchSourceCaseSensitive: false,
        }]));
        await focusEditor(page);
        await page.keyboard.type('this is a source string with spaces!!');

        // Act
        const resultContent: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(resultContent).toEqual("<_<!!");
    });

    it('Should not match case sensitive replacements on insensitive matches', async () => {
        // Arrange
        await page.evaluate(() => (window as any).editorPlugins.customReplace.updateReplacements([{
            sourceString: 'Hello',
            replacementHTML: '👋',
            matchSourceCaseSensitive: true,
        }]));
        await focusEditor(page);
        await page.keyboard.type('hello');

        // Act
        const resultContent: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(resultContent).toEqual("hello");
    });

    it('Should match case sensitive replacements on matches', async () => {
        // Arrange
        await page.evaluate(() => (window as any).editorPlugins.customReplace.updateReplacements([{
            sourceString: 'Hello',
            replacementHTML: '👋',
            matchSourceCaseSensitive: false,
        }]));
        await focusEditor(page);
        await page.keyboard.type('hello');

        // Act
        const resultContent: string = await page.evaluate(() => (window as any).globalRoosterEditor.getTextContent());
        expect(resultContent).toEqual("👋");
    });
});
