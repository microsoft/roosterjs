import * as TestHelper from '../TestHelper';
import applyCellShading from '../../lib/table/applyCellShading';
import { Browser } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

describe('applyCellShading', () => {
    let testID = 'applyCellShading';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    it('applyCellShading in table selection', () => {
        // Arrange
        editor.setContent(TestHelper.tableSelectionContents[0]);
        const expected = Browser.isFirefox
            ? '<table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgb(0, 255, 255);" data-original-background-color="rgb(0, 255, 255)" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>'
            : '<table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>';
        const cell = document.querySelector(`#${testID} table`).querySelector('td');
        const range = new Range();
        range.selectNode(cell);
        range.collapse();
        editor.select(range);

        editor.runAsync(() => {
            // Act
            applyCellShading(editor, '#00ffff');

            // Assert
            expect(editor.getContent()).toBe(expected);
        });
    });

    it('applyCellShading in text', () => {
        // Arrange
        const content = '';
        const expected = '';
        editor.setContent(content);

        // Act
        applyCellShading(editor, '#00ffff');

        // Assert
        expect(editor.getContent()).toBe(expected);
    });

    it('applyCellShading in collapsed range in cell', () => {
        // Arrange
        editor.setContent(
            '<div><table id="test_tsc"><tbody><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table></div>'
        );
        let cell = document.querySelector('#test_tsc').querySelector('td');
        const range = new Range();
        range.setStart(cell, 0);
        editor.select(range);

        // Act
        applyCellShading(editor, '#00ffff');

        cell = document.querySelector('#test_tsc').querySelector('td');
        // Assert
        expect(cell?.style.backgroundColor.replace(' ', '')).toEqual(
            'rgb(0, 255, 255)'.replace(' ', '')
        );
        expect(cell?.getAttribute('data-editing-info')).toBeDefined();
    });
});
