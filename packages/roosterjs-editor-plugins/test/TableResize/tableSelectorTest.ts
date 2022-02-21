import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor, SelectionRangeTypes } from 'roosterjs-editor-types';
import { TableResize } from '../../lib/TableResize';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

const TABLE_SELECTOR_LENGTH = 12;
const TABLE_SELECTOR_ID = '_Table_Selector';

describe('Table Selector Tests', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
    let targetId2 = 'tableSelectionTestId2';
    let tableResize: TableResize;

    beforeEach(() => {
        let node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        tableResize = new TableResize();

        let options: EditorOptions = {
            plugins: [tableResize],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
        };

        editor = new Editor(node as HTMLDivElement, options);
        editor.runAsync = callback => {
            callback(editor);
            return null;
        };
    });

    afterEach(() => {
        editor.dispose();
        editor = null;
        const div = document.getElementById(id);
        div.parentNode.removeChild(div);
    });

    it('tableSelector display on mouse move inside table', () => {
        editor.setContent(
            `<table id='table1'><tr ><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
        );
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);
        editor.focus();
        editor.select(target);

        simulateMouseEvent('mousemove', target2);

        editor.runAsync(editor => {
            const tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
            const table = editor.getDocument().getElementById('table1');
            if (tableSelector) {
                const rect = table.getBoundingClientRect();
                expect(tableSelector).toBeDefined();
                expect(tableSelector.style.top).toBe(`${rect.top - TABLE_SELECTOR_LENGTH}px`);
                expect(tableSelector.style.left).toBe(`${rect.left - TABLE_SELECTOR_LENGTH - 2}px`);
            }
        });
    });

    it('tableSelector on click event', () => {
        editor.setContent(
            `<div><table id=${targetId} cellspacing="0" cellpadding="1" data-rooster-table-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0}" style="border-collapse: collapse;" id="tableSelected0"><tbody><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table><br></div>`
        );
        const target = document.getElementById(targetId);
        simulateMouseEvent('mousemove', target);
        editor.runAsync(editor => {
            let tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
            simulateMouseEvent('mousedown', tableSelector);
            simulateMouseEvent('mouseup', tableSelector);

            expect(tableSelector).toBeDefined();
            const selection = editor.getSelectionRangeEx();
            expect(selection.type).toBe(SelectionRangeTypes.TableSelection);
            if (selection.type == SelectionRangeTypes.TableSelection) {
                expect(selection.coordinates).toEqual({
                    firstCell: {
                        x: 0,
                        y: 0,
                    },
                    lastCell: {
                        y: 7,
                        x: 7,
                    },
                });
                expect(selection.ranges.length).toBe(8);
            }
        });
    });
});

function simulateMouseEvent(type: string, target: HTMLElement, point?: { x: number; y: number }) {
    const rect = target.getBoundingClientRect();
    var event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: rect.left + (point != undefined ? point?.x : 0),
        clientY: rect.top + (point != undefined ? point?.y : 0),
    });
    target.dispatchEvent(event);
}
