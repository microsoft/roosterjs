import * as TestHelper from '../TestHelper';
import changeFontSize, { FONT_SIZES, getNewFontSize } from '../../lib/format/changeFontSize';
import { Browser } from 'roosterjs-editor-dom';
import { FontSizeChange, IEditor } from 'roosterjs-editor-types';

describe('getNewFontSize()', () => {
    function runTest(currentSize: number, isIncrease: boolean, expectedSize: number) {
        expect(getNewFontSize(currentSize, isIncrease ? 1 : -1, FONT_SIZES)).toBe(
            expectedSize,
            `input: ${currentSize}, isIncrease: ${isIncrease}`
        );
    }

    function testIncrease(currentSize: number, expectedSize: number) {
        runTest(currentSize, true, expectedSize);
    }

    function testDecrease(currentSize: number, expectedSize: number) {
        runTest(currentSize, false, expectedSize);
    }

    it('Test increase font size', () => {
        testIncrease(0, 1);
        testIncrease(0.5, 1);
        testIncrease(1, 2);
        testIncrease(1.5, 2);
        testIncrease(7.5, 8);
        testIncrease(8, 9);
        testIncrease(8.5, 9);
        testIncrease(11, 12);
        testIncrease(11.5, 12);
        testIncrease(12, 14);
        testIncrease(12.5, 14);
        testIncrease(13.5, 14);
        testIncrease(14, 16);
        testIncrease(28, 36);
        testIncrease(28.5, 36);
        testIncrease(36, 48);
        testIncrease(48.5, 72);
        testIncrease(71.5, 72);
        testIncrease(72, 80);
        testIncrease(79.5, 80);
        testIncrease(80, 90);
    });

    it('Test decrease font size', () => {
        testDecrease(0, 1);
        testDecrease(0.5, 1);
        testDecrease(1, 1);
        testDecrease(1.5, 1);
        testDecrease(2, 1);
        testDecrease(7.5, 7);
        testDecrease(8, 7);
        testDecrease(8.5, 8);
        testDecrease(11, 10);
        testDecrease(11.5, 11);
        testDecrease(12, 11);
        testDecrease(12.5, 12);
        testDecrease(13.5, 12);
        testDecrease(14, 12);
        testDecrease(28, 26);
        testDecrease(28.5, 28);
        testDecrease(36, 28);
        testDecrease(48.5, 48);
        testDecrease(71.5, 48);
        testDecrease(72, 48);
        testDecrease(72.5, 72);
        testDecrease(80, 72);
        testDecrease(80.5, 80);
        testDecrease(90, 80);
    });
});

describe('changeFontSize', () => {
    let testID = 'changeFontSize';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(source: string, increaseResult: string, decreaseResult: string) {
        editor.setContent(source);
        changeFontSize(editor, FontSizeChange.Increase);
        expect(editor.getContent()).toBe(increaseResult);

        editor.setContent(source);
        changeFontSize(editor, FontSizeChange.Decrease);
        expect(editor.getContent()).toBe(decreaseResult);
    }

    it('empty editor', () => {
        runTest('', '', '');
    });

    it('Single text node', () => {
        runTest(
            'test<!--{"start":[0,0],"end":[0,4]}-->',
            '<span style="font-size: 14pt;">test</span>',
            '<span style="font-size: 11pt;">test</span>'
        );
    });

    it('Single partial text node', () => {
        runTest(
            'test<!--{"start":[0,1],"end":[0,3]}-->',
            't<span style="font-size: 14pt;">es</span>t',
            't<span style="font-size: 11pt;">es</span>t'
        );
    });

    it('Multiple nodes in single block', () => {
        runTest(
            'test1<span style="font-size:20pt">test2</span><!--{"start":[0,2],"end":[1,0,2]}-->',
            'te<span style="font-size: 14pt;">st1</span><span style="font-size: 22pt;">te</span><span style="font-size:20pt">st2</span>',
            'te<span style="font-size: 11pt;">st1</span><span style="font-size: 18pt;">te</span><span style="font-size:20pt">st2</span>'
        );
    });

    it('Multiple nodes in multiple blocks', () => {
        runTest(
            'test1<span style="font-size:20pt">test2</span><div>test3</div><!--{"start":[0,2],"end":[2,0,2]}-->',
            'te<span style="font-size: 14pt;">st1</span><span style="font-size: 22pt;">test2</span><div><span style="font-size: 14pt;">te</span>st3</div>',
            'te<span style="font-size: 11pt;">st1</span><span style="font-size: 18pt;">test2</span><div><span style="font-size: 11pt;">te</span>st3</div>'
        );
    });

    it('Nested nodes', () => {
        runTest(
            '<div style="font-size:15pt">test1<span style="font-size:20pt">test2<span style="font-size:26pt">test3</span>test4</span>test5</div><!--{"start":[0,1,1,0,2],"end":[0,2,2]}-->',
            '<div style="font-size:15pt">test1<span style="font-size:20pt">test2<span style="font-size:26pt">te</span><span style="font-size: 28pt;">st3</span></span><span style="font-size: 22pt;">test4</span><span style="font-size: 16pt;">te</span>st5</div>',
            '<div style="font-size:15pt">test1<span style="font-size:20pt">test2<span style="font-size:26pt">te</span><span style="font-size: 24pt;">st3</span></span><span style="font-size: 18pt;">test4</span><span style="font-size: 14pt;">te</span>st5</div>'
        );
    });

    it('Process line height', () => {
        runTest(
            'test1<span style="line-height: 50px">test2</span>test3<!--{"start":[0,2],"end":[1,0,2]}-->',
            'te<span style="font-size: 14pt;">st1</span><span style="line-height: normal; font-size: 14pt;">te</span><span style="line-height: 50px">st2</span>test3',
            'te<span style="font-size: 11pt;">st1</span><span style="line-height: normal; font-size: 11pt;">te</span><span style="line-height: 50px">st2</span>test3'
        );
    });

    xit('Process in table selection', () => {
        runTest(
            '<div id="divToTest">' + TestHelper.tableSelectionContents[0] + '</div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 14pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>',
            Browser.isFirefox
                ? '<div id="divToTest"><table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
                : '<div id="divToTest"><table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><span style="font-size: 11pt;">Test</span></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table></div>'
        );
    });
});
