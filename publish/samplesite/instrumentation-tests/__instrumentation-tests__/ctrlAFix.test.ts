import setupTest from './utils/setupTest';
import focusEditor from './utils/focusEditor';
import setDefaultFormat from './utils/setDefaultFormat';
import getTextStyleAtSelection from './utils/getTextStyleAtSelection';
import { Page } from 'puppeteer';

describe('Editor', () => {
    let page: Page = null
    beforeEach(async () => {
        page = await setupTest();
    })

    afterEach(async () => {
        await page.close();
    })

    it('should type with default styles when the user types after pressing ctrl+a', async () => {
        // Arrange
        await setDefaultFormat(page, {
            bold: true,
            italic: true,
            underline: true,
        });
        await focusEditor(page);
        await page.keyboard.type('hi');

        // Act
        await page.keyboard.down('Control');
        await page.keyboard.press('a');
        await page.keyboard.up('Control');
        await page.keyboard.type('bye');

        // Assert
        const { fontWeight, fontStyle, textDecoration } = await page.evaluate(getTextStyleAtSelection);
        expect(fontWeight | 0).toBeGreaterThan(400);
        expect(fontStyle).toBe('italic');
        expect(textDecoration).toContain('underline');
    })
})