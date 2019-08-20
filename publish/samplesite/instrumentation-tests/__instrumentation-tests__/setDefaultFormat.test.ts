import loadSampleSite from './utils/loadSampleSite';
import focusEditor from './utils/focusEditor';
import setDefaultFormat from './utils/setDefaultFormat';
import getTextStyleAtSelection from './utils/getTextStyleAtSelection';
import { Page } from 'puppeteer';

describe('Test Harness setDefaultFormat', () => {
    let page: Page = null;
    beforeEach(async () => {
        page = await loadSampleSite();
    });

    afterEach(async () => {
        await page.close();
    });

    it('defaults to nonbold nonitalic nonunderlined ', async () => {
        // Assert
        await focusEditor(page);
        const { fontWeight, fontStyle, textDecoration } = await page.evaluate(
            getTextStyleAtSelection
        );
        expect(fontWeight).toBe('400');
        expect(fontStyle).toBe('normal');
        expect(textDecoration).not.toContain('underline');
    });

    it('makes new text bold when the default format has bold:true ', async () => {
        // Arrange
        await setDefaultFormat(page, {
            bold: true,
        });
        await focusEditor(page);

        // Act
        await page.keyboard.type('bold?');

        // Assert
        const { fontWeight } = await page.evaluate(getTextStyleAtSelection);
        expect(fontWeight | 0).toBeGreaterThan(400);
    });

    it('makes new text italic when the default format has italic:true ', async () => {
        // Arrange
        await setDefaultFormat(page, {
            italic: true,
        });
        await focusEditor(page);

        // Act
        await page.keyboard.type('italic?');

        // Assert
        const { fontStyle } = await page.evaluate(getTextStyleAtSelection);
        expect(fontStyle).toBe('italic');
    });

    it('makes new text underlined when the default format has underline:true ', async () => {
        // Arrange
        await setDefaultFormat(page, {
            underline: true,
        });
        await focusEditor(page);

        // Act
        await page.keyboard.type('underline?');

        // Assert
        const { textDecoration } = await page.evaluate(getTextStyleAtSelection);
        expect(textDecoration).toContain('underline');
    });
});
