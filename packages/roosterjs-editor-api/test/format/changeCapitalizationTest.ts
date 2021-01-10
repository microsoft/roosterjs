import * as TestHelper from '../TestHelper';
import changeCapitalization from '../../lib/format/changeCapitalization';
import { Capitalization } from 'roosterjs-editor-types';
import { IEditor } from 'roosterjs-editor-types';

describe('changeCapitalization()', () => {
    let testID = 'changeCapitalization';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
        TestHelper.removeElement(testID);
    });

    function runTest(source: string, expected: string, capitalization: Capitalization) {
        editor.setContent(source);
        TestHelper.selectNode(document.getElementById('text'));
        changeCapitalization(editor, capitalization);
        let result = editor.getContent();
        expect(result).toBe(expected);
    }

    it('UPPERCASE', () => {
        runTest(
            '<div id="text">text</div>',
            '<div id="text"><span>TEXT</span></div>',
            Capitalization.Uppercase
        );
    });

    it('lowercase', () => {
        runTest(
            '<div id="text">TEXT</div>',
            '<div id="text"><span>text</span></div>',
            Capitalization.Lowercase
        );
    });

    it('Capitalize', () => {
        runTest(
            '<div id="text">text</div>',
            '<div id="text"><span>Text</span></div>',
            Capitalization.Capitalize
        );
    });

    it('Capitalize Each Word from lowercase', () => {
        runTest(
            '<div id="text">first second third</div>',
            '<div id="text"><span>First Second Third</span></div>',
            Capitalization.Capitalize
        );
    });

    it('Capitalize Each Word from UPPERCASE', () => {
        runTest(
            '<div id="text">FIRST SECOND THIRD</div>',
            '<div id="text"><span>First Second Third</span></div>',
            Capitalization.Capitalize
        );
    });

    it('styled content will retain styling after changing capitalization', () => {
        runTest(
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>text</b></div>',
            '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><span><b>TEXT</b></span></div>',
            Capitalization.Uppercase
        );
    });

    // lists, acentos, dots over i, br, spaces,

    // it('will retain list format when changing capitalization', () => {
    //     runTest('<div></div>', '</div></div>', Capitalization.Uppercase);
    // });

    // it('Empty line', () => {
    //     runTest('<div><br></div><!--{"start":[0],"end":[0]}-->', '<div><br></div>');
    // });

    // it('Hyperlink', () => {
    //     runTest(
    //         '<div>This is a <a href="http://contoso.com" title="http://contoso.com">test</a></div><!--{"start":[0,1,0,0],"end":[0,1,0,4]}-->',
    //         '<div>This is a <a href="http://contoso.com">test</a></div>'
    //     );
    // });

    // it('Fonts', () => {
    //     runTest(
    //         '<div><span style="font-size: 36pt;">Thi</span><span style="font-size: 36pt; color: rgb(117, 123, 128);">s </span><span style="color: rgb(117, 123, 128);">i</span><span style="color: rgb(117, 123, 128); background-color: rgb(0, 0, 255);">s</span><span style="background-color: rgb(0, 0, 255);"> a </span><span style="background-color: rgb(0, 0, 255); font-family: Arial;">t</span><span style="font-family: Arial;">est</span></div><!--{"start":[0,6,0,3],"end":[0,6,0,3]}-->',
    //         '<div>This is a test</div>'
    //     );
    // });

    // it('Super/Subscripts', () => {
    //     runTest(
    //         '<div><sup>This</sup> is <sub>a</sub> test</div><!--{"start":[0,3,5],"end":[0,3,5]}-->',
    //         '<div>This is a test</div>'
    //     );
    // });

    // it('Multi lines', () => {
    //     runTest(
    //         '<div>This</div><div>is<br>a</div><div>test</div><!--{"start":[0,0,0],"end":[2,0,4]}-->',
    //         '<div>This</div><div>is<br>a</div><div>test</div>'
    //     );
    // });

    // it('List - select all', () => {
    //     runTest(
    //         '<div>This</div><div><ul><li>is</li><ul><li>a</li><li>test</li></ul></ul></div><!--{"start":[0,0,0],"end":[1,0,1,1,0,4]}-->',
    //         '<div>This</div><div>is</div><div>a</div><div>test</div>'
    //     );
    // });

    // it('List - select partial', () => {
    //     runTest(
    //         '<div>This</div><div><ul><li>is</li><ul><li>a</li><li>test</li></ul></ul></div><!--{"start":[1,0,1,0,0,0],"end":[1,0,1,0,0,0]}-->',
    //         '<div>This</div><div><ul><li>is</li></ul></div><div>a</div><div><ul><ul><li>test</li></ul></ul></div>'
    //     );
    // });

    // it('List in table - select partial', () => {
    //     runTest(
    //         '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,1,2,1,0,0,2],"end":[0,0,0,0,1,2,1,0,0,2]}-->',
    //         '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li></ul><div>test</div></td></tr></tbody></table><br></div>'
    //     );
    // });

    // it('List in table - select cross cell', () => {
    //     runTest(
    //         '<div><table><tbody><tr><td>This</td><td>is<br><ul><li>a</li><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div><!--{"start":[0,0,0,0,0,0,2],"end":[0,0,0,0,1,2,0,0,1]}-->',
    //         '<div><table><tbody><tr><td>This</td><td>is<br><div>a</div><ul><ul><li>test</li></ul></ul></td></tr></tbody></table><br></div>'
    //     );
    // });

    // it('Table has styles', () => {
    //     runTest(
    //         '<div><table><tr><td style="width: 120px;border-width: 1px;border-style: solid;border-color: rgb(171, 171, 171);font-size: 30px;">This is a test</td></tr></table><br></div><!--{"start":[0,0,0,0,0,14],"end":[0,0,0,0,0,14]}-->',
    //         '<div><table><tbody><tr><td style="border-width:1px;border-style:solid;border-color:rgb(171, 171, 171)"><div>This is a test</div></td></tr></tbody></table><br></div>'
    //     );
    // });

    // it('Keep <BR>', () => {
    //     runTest(
    //         '<div>aaa<br>bbb<br>ccc</div><!--{"start":[0,0,0],"end":[0,4,3]}-->',
    //         '<div>aaa<br>bbb<br>ccc</div>'
    //     );
    // });

    // it('Keep <IMG>', () => {
    //     runTest(
    //         'test<img src="test" width="100%">test<!--{"start":[0,0],"end":[2,4]}-->',
    //         'test<img src="test">test'
    //     );
    // });

    // ///

    // let originalContent = '<div id="text">text</div>';

    // it('it changes texto to uppercase', () => {
    //     // Arrange
    //     editor.setContent(originalContent);
    //     TestHelper.selectNode(document.getElementById('text'));

    //     // Act
    //     changeCapitalization(editor, Capitalization.Uppercase);

    //     // Assert
    //     expect(editor.getContent()).toBe('<div id="text"><span>TEXT</span></div>');
    // });

    // it('if select an unbold string and then toggle bold, only the selected string will wrap with <b></b>', () => {
    //     // Arrange
    //     editor.setContent(originalContent);
    //     TestHelper.selectText(document.getElementById('text').firstChild, 0, 3);

    //     // Act
    //     changeCapitalization(editor);

    //     // Assert
    //     expect(editor.getContent()).toBe(
    //         '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>tex</b>t</div>'
    //     );
    // });

    // it('if select a styled string and then change capitalization, the string will remain styled', () => {
    //     // Arrange
    //     editor.setContent(
    //         '<div id="text" style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0);"><b>text</b></div>'
    //     );
    //     TestHelper.selectNode(document.getElementById('text'));

    //     // Act
    //     changeCapitalization(editor, Capitalization.Capitalize);

    //     // Assert
    //     expect(editor.getContent()).toBe(originalContent);
    // });
});
