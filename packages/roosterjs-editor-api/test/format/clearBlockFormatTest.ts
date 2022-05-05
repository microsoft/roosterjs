import * as TestHelper from '../TestHelper';
import clearBlockFormat from '../../lib/format/clearBlockFormat';
import { IEditor } from 'roosterjs-editor-types';

describe('clearBlockFormat()', () => {
    let testID = 'clearBlockFormat';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID, undefined, undefined, {});
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(source: string, expected: string) {
        editor.setContent(source);
        clearBlockFormat(editor);
        let result = editor.getContent();
        expect(result).toBe(expected);
    }

    it('Empty', () => {
        runTest('', '');
    });

    TestHelper.itFirefoxOnly('Empty DIV', () => {
        runTest('<div></div><!--{"start":[0],"end":[0]}-->', '');
    });

    it('Empty line', () => {
        runTest('<div><br></div><!--{"start":[0],"end":[0]}-->', '<div><br></div>');
    });

    it('BIU', () => {
        // The selection path like {"start":[0,1,1,0,0],"end":[0,2,0,5]} is generated from the "Take snapshot" functionality of sample site
        runTest(
            '<div><b>This <i>is</i></b><i> <u>a</u></i><u> test</u></div><!--{"start":[0,1,1,0,0],"end":[0,2,0,5]}-->',
            '<div>This is a test</div>'
        );
    });

    it('Hyperlink', () => {
        runTest(
            '<div>This is a <a href="http://contoso.com" title="http://contoso.com">test</a></div><!--{"start":[0,1,0,0],"end":[0,1,0,4]}-->',
            '<div>This is a <a href="http://contoso.com">test</a></div>'
        );
    });

    it('Fonts', () => {
        runTest(
            '<div><span style="font-size: 36pt;">Thi</span><span style="font-size: 36pt; color: rgb(117, 123, 128);">s </span><span style="color: rgb(117, 123, 128);">i</span><span style="color: rgb(117, 123, 128); background-color: rgb(0, 0, 255);">s</span><span style="background-color: rgb(0, 0, 255);"> a </span><span style="background-color: rgb(0, 0, 255); font-family: Arial;">t</span><span style="font-family: Arial;">est</span></div><!--{"start":[0,6,0,3],"end":[0,6,0,3]}-->',
            '<div>This is a test</div>'
        );
    });

    it('Super/Subscripts', () => {
        runTest(
            '<div><sup>This</sup> is <sub>a</sub> test</div><!--{"start":[0,3,5],"end":[0,3,5]}-->',
            '<div>This is a test</div>'
        );
    });

    it('Multi lines', () => {
        runTest(
            '<div>This</div><div>is<br>a</div><div>test</div><!--{"start":[0,0,0],"end":[2,0,4]}-->',
            '<div>This</div><div>is<br>a</div><div>test</div>'
        );
    });

    it('List - select all', () => {
        runTest(
            '<div>This</div><div><ul><li>is</li><ul><li>a</li><li>test</li></ul></ul></div><!--{"start":[0,0,0],"end":[1,0,1,1,0,4]}-->',
            '<div>This</div><div>is</div><div>a</div><div>test</div>'
        );
    });

    it('List - select partial', () => {
        runTest(
            '<div>This</div><div><ul><li>is</li><ul><li>a</li><li>test</li></ul></ul></div><!--{"start":[1,0,1,0,0,0],"end":[1,0,1,0,0,0]}-->',
            '<div>This</div><div><ul><li>is</li></ul></div><div>a</div><div><ul><ul><li>test</li></ul></ul></div>'
        );
    });

    it('List in table - select partial', () => {
        runTest(
            '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,1,2,1,0,0,2],"end":[0,0,0,0,1,2,1,0,0,2]}-->',
            '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li></ul><div>test</div></td></tr></tbody></table><br></div>'
        );
    });

    it('List in table - select cross cell', () => {
        runTest(
            '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,0,0,2],"end":[0,0,0,0,1,2,0,0,1]}-->',
            '<div><table><tbody><tr><td>This</td><td>is<br><div>a</div><ul><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div>'
        );
    });

    it('Table has styles', () => {
        runTest(
            '<div><table><tr><td style="width: 120px;border-width: 1px;border-style: solid;border-color: rgb(171, 171, 171);font-size: 30px;">This is a test</td></tr></table><br></div><!--{"start":[0,0,0,0,0,14],"end":[0,0,0,0,0,14]}-->',
            '<div><table><tbody><tr><td style="border-width:1px;border-style:solid;border-color:rgb(171, 171, 171)"><div>This is a test</div></td></tr></tbody></table><br></div>'
        );
    });

    it('Keep <BR>', () => {
        runTest(
            '<div>aaa<br>bbb<br>ccc</div><!--{"start":[0,0,0],"end":[0,4,3]}-->',
            '<div>aaa<br>bbb<br>ccc</div>'
        );
    });

    it('Keep <IMG>', () => {
        runTest(
            'test<img src="test" width="100%">test<!--{"start":[0,0],"end":[2,4]}-->',
            'test<img src="test">test'
        );
    });
});
