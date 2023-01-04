import * as TestHelper from '../TestHelper';
import toggleBlockQuote from '../../lib/format/toggleBlockQuote';
import { Browser } from 'roosterjs-editor-dom';
import { IEditor } from 'roosterjs-editor-types';

describe('toggleBlockQuote', () => {
    let testID = 'toggleBlockQuote';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(source: string, expected: string) {
        editor.setContent(source);
        toggleBlockQuote(editor, () => {});
        let result = editor.getContent();
        expect(result).toBe(expected);
    }

    it('Empty input, feature off', () => {
        runTest('<!--{"start":[0],"end":[0]}-->', '<blockquote><div><br></div></blockquote>');
    });

    TestHelper.itFirefoxOnly('Empty DIV, feature off', () => {
        runTest(
            '<div></div><!--{"start":[0],"end":[0]}-->',
            '<blockquote><div><br></div></blockquote>'
        );
    });

    it('Pure text', () => {
        runTest('text<!--{"start":[0],"end":[0]}-->', '<blockquote>text</blockquote>');
    });

    it('Text with BR', () => {
        runTest(
            'text<br>text<!--{"start":[0,3],"end":[0,3]}-->',
            '<blockquote>text<br></blockquote>text'
        );
    });

    it('DIV with text', () => {
        runTest(
            '<div>text</div><!--{"start":[0],"end":[0]}-->',
            '<blockquote><div>text</div></blockquote>'
        );
    });

    it('Multiple lines, single selection', () => {
        runTest(
            '<div>text1</div><div>text2</div><!--{"start":[0,0,3],"end":[0,0,3]}-->',
            '<blockquote><div>text1</div></blockquote><div>text2</div>'
        );
    });

    it('Multiple lines, multiple selections', () => {
        runTest(
            '<div>text1</div><div>text2</div><div>text3</div><div>text4</div><!--{"start":[1,0,3],"end":[2,0,2]}-->',
            '<div>text1</div><blockquote><div>text2</div><div>text3</div></blockquote><div>text4</div>'
        );
    });

    it('Multiple lines, multiple layers', () => {
        runTest(
            '<div>text1<div>text2<div>text3</div></div></div><!--{"start":[0,0,2],"end":[0,1,0,2]}-->',
            '<div><blockquote>text1<div>text2</div></blockquote><div><div>text3</div></div></div>'
        );
    });

    it('Multi-level list', () => {
        runTest(
            '<div><ol><li><span>a</span></li><ol><li>b</li><ol><li>c</li><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></div><div>h</div><!--{"start":[0,0,1,1,1,0,0],"end":[0,1,0,1]}-->',
            '<div><ol><li><span>a</span></li><ol style="list-style-type: lower-alpha;"><li>b</li><ol style="list-style-type: lower-roman;"><li>c</li></ol></ol></ol><blockquote><ol start="2"><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></blockquote></div><div>h</div>'
        );
    });

    it('Two multilevel lists', () => {
        runTest(
            '<div><ol><li><span>a</span></li><ol><li>b</li><ol><li>c</li><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></div><div>h</div><div><ol><li><span>a</span></li><ol><li>b</li><ol><li>c</li><li>d</li></ol><li>e</li></ol><li>f</li></ol></div><!--{"start":[0,0,1,1,1,0,0],"end":[2,0,1,1,0,0,1]}-->',
            '<div><ol><li><span>a</span></li><ol style="list-style-type: lower-alpha;"><li>b</li><ol style="list-style-type: lower-roman;"><li>c</li></ol></ol></ol></div><blockquote><div><ol start="2"><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></div><div>h</div><div><ol><li><span>a</span></li><ol style="list-style-type: lower-alpha;"><li>b</li><ol style="list-style-type: lower-roman;"><li>c</li></ol></ol></ol></div></blockquote><div><ol start="2"><ol style="list-style-type: lower-alpha;"><ol style="list-style-type: lower-roman;"><li>d</li></ol><li>e</li></ol><li>f</li></ol></div>'
        );
    });

    it('Whole list selected', () => {
        runTest(
            '0<div><ol><li><span>a</span></li><ol><li>b</li><ol><li>c</li><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></div><div>h</div><!--{"start":[0,0],"end":[1,1,0,1]}-->',
            '<blockquote>0<div><ol><li><span>a</span></li><ol style="list-style-type: lower-alpha;"><li>b</li><ol style="list-style-type: lower-roman;"><li>c</li><li>d</li></ol><li>e</li></ol><li>f</li></ol><div>g</div></div></blockquote><div>h</div>'
        );
    });

    it('Partial selected table', () => {
        runTest(
            '<table><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table><!--{"start":[0,0,0,0,0,0],"end":[0,0,1,0,0,1]}-->',
            '<table><tbody><tr><td><blockquote>a</blockquote></td></tr><tr><td><blockquote>b</blockquote></td></tr></tbody></table>'
        );
    });

    it('Full selected table', () => {
        runTest(
            '0<table><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table>1<!--{"start":[0,0],"end":[2,1]}-->',
            '<blockquote>0<table><tbody><tr><td>a</td></tr><tr><td>b</td></tr></tbody></table>1</blockquote>'
        );
    });

    it('Multi-level tables', () => {
        runTest(
            '0<table><tbody><tr><td>a</td></tr><tr><td><table><tbody><tr><td>b<br>c</td></tr></tbody></table>d</td></tr></tbody></table>1<!--{"start":[1,0,1,0,0,0,0,0,2,0],"end":[2,1]}-->',
            '0<table><tbody><tr><td>a</td></tr><tr><td><table><tbody><tr><td>b<br><blockquote>c</blockquote></td></tr></tbody></table><blockquote>d</blockquote></td></tr></tbody></table><blockquote>1</blockquote>'
        );
    });

    it('Mixed table and list', () => {
        runTest(
            '<div><table><tbody><tr><td>test1</td><td>test2</td></tr><tr><td>test3</td><td>test4</td></tr></tbody></table>test5</div><div><ol><li>test6</li><li>test7</li></ol></div><!--{"start":[0,0,0,1,0,0,2],"end":[1,0,0,0,2]}-->',
            '<div><table><tbody><tr><td>test1</td><td>test2</td></tr><tr><td><blockquote>test3</blockquote></td><td><blockquote>test4</blockquote></td></tr></tbody></table></div><blockquote><div>test5</div><div><ol><li>test6</li></ol></div></blockquote><div><ol start="2"><li>test7</li></ol></div>'
        );
    });

    it('Existing quote', () => {
        runTest('<blockquote>a</blockquote><!--{"start":[0,0,1],"end":[0,0,1]}-->', 'a');
    });

    it('Existing multi-line quote', () => {
        runTest('<blockquote>a<br>b</blockquote><!--{"start":[0,0,1],"end":[0,0,1]}-->', 'a<br>b');
    });

    it('Existing multiple quotes', () => {
        runTest(
            '<blockquote><div>a</div><div>b</div></blockquote><div>c</div><div>d</div><blockquote><div>e</div><div>f</div></blockquote><!--{"start":[0,1,0,0],"end":[3,0,0,1]}-->',
            '<div>a</div><div>b</div><div>c</div><div>d</div><div>e</div><div>f</div>'
        );
    });

    xit('Toggle in Table Selection', () => {
        const expected = Browser.isFirefox
            ? '<table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>'
            : '<table cellspacing="0" cellpadding="1" style="border-collapse: collapse;" class="_tableSelected"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>';

        runTest(TestHelper.tableSelectionContents[0], expected);
    });

    xit('Toggle off in Table Selection', () => {
        const toggledContent =
            '<table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected"><blockquote>Test</blockquote></td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>';
        runTest(
            toggledContent,
            '<table style="border-collapse: collapse;" class="_tableSelected" cellspacing="0" cellpadding="1"><tbody><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: rgba(198, 198, 198, 0.7);" data-original-background-color="" class="_tableCellSelected">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr><tr style="background-color: rgb(255, 255, 255);"><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171);">Test</td></tr></tbody></table>'
        );
    });
});

describe('toggleBlockQuote with styler', () => {
    let testID = 'toggleBlockQuote2';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(source: string, styler: (element: HTMLElement) => void, expected: string) {
        editor.setContent(source);
        toggleBlockQuote(editor, styler);
        let result = editor.getContent();
        expect(result).toBe(expected);
    }

    it('simple text', () => {
        runTest(
            '<div>test</div>',
            e => {
                e.style.color = 'red';
            },
            '<blockquote style="color: red;"><div>test</div></blockquote>'
        );
    });
});
