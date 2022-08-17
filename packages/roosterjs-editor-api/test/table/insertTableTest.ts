import * as TestHelper from '../TestHelper';
import insertTable from '../../lib/table/insertTable';
import { IEditor } from 'roosterjs-editor-types';

describe('InsertTable', () => {
    let testID = 'insertTableId';
    let testElementId = 'insertTableId2';
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(testID);
    });

    afterEach(() => {
        editor.dispose();
    });

    it('Insert Table after not editable inline-block', () => {
        editor.setContent(
            `<div id="${testElementId}"><span class="_Entity _EType_ _EReadonly_1" contenteditable="false" style="display: inline-block;"><span data-hydrated-html=""><span><span><a><img>Document44.docx<span><img></span></a></span></span></span></span></div>`
        );
        const target = document.getElementById(testElementId);
        const range = new Range();
        range.setStart(target, 1);
        editor.select(range);
        insertTable(editor, 1, 2);

        editor.queryElements('table', table => {
            expect(table.isContentEditable).toBe(true);
        });
    });

    TestHelper.itChromeOnly('Insert Table after other table', () => {
        editor.setContent(`<div id="${testElementId}"><table><tr><td></td></tr></table></div>`);
        const target = document.getElementById(testElementId);
        const range = new Range();
        range.setStart(target!, 1);
        editor.select(range);
        insertTable(editor, 1, 1);

        const content = editor.getContent();
        expect(content).toBe(
            '<div id="insertTableId2"><table><tbody><tr><td></td></tr></tbody></table><br><table cellspacing="0" cellpadding="1" data-editing-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0,&quot;keepCellShade&quot;:false}" style="border-collapse: collapse;"><tbody><tr><td style="width: 120px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr></tbody></table></div>'
        );
    });

    it('Remove background color on insert table', () => {
        editor.setContent(`<span id="${testElementId}" style='background-color: purple'></span>`);
        const target = document.getElementById(testElementId);
        const range = new Range();
        range.setStart(target!, 0);
        editor.select(range);
        insertTable(editor, 1, 1);

        expect(target?.style.backgroundColor).toBe('transparent');
    });
});
