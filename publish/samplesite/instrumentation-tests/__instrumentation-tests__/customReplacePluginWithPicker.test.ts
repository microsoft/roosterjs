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

    describe('Precondition checks', () => {
        it('has no picker by default', async () => {
            // Arrange
            await focusEditor(page);

            // Assert
            const isPickerOpen = await page.evaluate(
                () => document.querySelector('.sample-color-picker') !== null
            );
            expect(isPickerOpen).toBe(false);
        });

        it('opens a picker on pressing ":"', async () => {
            // Arrange
            await focusEditor(page);

            // Act
            await page.keyboard.type(':');

            // Assert
            const isPickerOpen = await page.evaluate(
                () => document.querySelector('.sample-color-picker') !== null
            );
            expect(isPickerOpen).toBe(true);
        });

        it('closes a picker after pressing "esc" when a picker is open', async () => {
            // Arrange
            await focusEditor(page);

            // Act
            await page.keyboard.type(':');
            await page.keyboard.press('Escape');

            // Assert
            const isPickerOpen = await page.evaluate(
                () => document.querySelector('.sample-color-picker') !== null
            );
            expect(isPickerOpen).toBe(false);
        });
    });

    it("does not autocomplete shortcuts starting with the picker's trigger character when the picker is open", async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: ':o',
                    replacementHTML: '🙀',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);

        // Act
        await page.keyboard.type(':o');

        // Assert
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual(':o');
    });

    it('does not autocomplete shortcuts in the picker search text when the picker is open', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: ';o',
                    replacementHTML: '🙀',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);

        // Act
        await page.keyboard.type(':zz;o');

        // Assert
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual(':zz;o');
    });

    it('does not autocomplete shortcuts immediately after the picker is dismissed', async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: ':o',
                    replacementHTML: '🙀',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);

        // Act
        await page.keyboard.type(':o');
        await page.keyboard.press('Escape');

        // Assert
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual(':o');
    });

    it("does autocomplete shortcuts in the picker's search text after the picker is dismissed", async () => {
        // Arrange
        await page.evaluate(() =>
            window.globalRoosterEditorNamedPlugins.customReplace.updateReplacements([
                {
                    sourceString: ':o',
                    replacementHTML: '🙀',
                    matchSourceCaseSensitive: false,
                },
            ])
        );
        await focusEditor(page);

        // Act
        await page.keyboard.type(':');
        await page.keyboard.press('Escape');
        await page.keyboard.type('o');

        // Assert
        const resultContent: string = await page.evaluate(() =>
            window.globalRoosterEditor.getTextContent()
        );
        expect(resultContent.trim()).toEqual('🙀');
    });
});
