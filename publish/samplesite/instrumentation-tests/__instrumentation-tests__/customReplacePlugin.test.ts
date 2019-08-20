import loadSampleSite from './utils/loadSampleSite';
import focusEditor from './utils/focusEditor';
import { Page } from 'puppeteer';

describe('CustomReplacePlugin', () => {
    let page: Page = null;
    beforeEach(async () => {
        page = await loadSampleSite();
    });

    afterEach(async () => {
        await page.close();
    });

    it('Should convert <3 to a heart in the default configuration', async () => {
        // Arrange
        await focusEditor(page);

        // Act
        await page.keyboard.type('<3');

        // Assert
        const content: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(content.trim()).toEqual('❤️');
    });

    it('Should undo to the raw text before the autocomplete', async () => {
        // Arrange
        await focusEditor(page);
        await page.keyboard.type('<3');
        const preconditionContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(preconditionContent.trim()).toEqual('❤️');

        // Act
        await page.keyboard.down('Control');
        await page.keyboard.press('z');
        await page.keyboard.up('Control');

        // Assert
        const content: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(content.trim()).toEqual('<3');
    });

    it('Should revert to raw text when the user presses backspace after the autocomplete', async () => {
        // Arrange
        await focusEditor(page);
        await page.keyboard.type('<3');
        const preconditionContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(preconditionContent.trim()).toEqual('❤️');

        // Act
        await page.keyboard.press('Backspace');

        // Assert
        const content: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(content.trim()).toEqual('<3');
    });

    it('Should autocomplete replacements with spaces in them', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: 'this is a source string with spaces',
                    replacementHTML: '<_<',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);
        await page.keyboard.type('this is a source string with spaces');

        // Act
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual('<_<');
    });

    it('Should autocomplete when the user continues typing after a replacement', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: 'this is a source string with spaces',
                    replacementHTML: '<_<',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);
        await page.keyboard.type('this is a source string with spaces!!');

        // Act
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual('<_<!!');
    });

    it('Should not match case other replacements on case sensitive matches', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: 'Hello',
                    replacementHTML: '👋',
                    matchSourceCaseSensitive: true,
                },
            ])
        );
        await focusEditor(page);
        await page.keyboard.type('hello');

        // Act
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual('hello');
    });

    it('Should match case insensitive source strings on case insensitive matches', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: 'Hello',
                    replacementHTML: '👋',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);
        await page.keyboard.type('hello');

        // Act
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual('👋');
    });
});
