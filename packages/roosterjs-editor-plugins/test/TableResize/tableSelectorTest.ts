import TableEditor from '../../lib/plugins/TableResize/editors/TableEditor';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor, SelectionRangeTypes } from 'roosterjs-editor-types';
import { TableResize } from '../../lib/TableResize';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

const TABLE_SELECTOR_ID = '_Table_Selector';

describe('Table Selector Tests', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
    let targetId2 = 'tableSelectionTestId2';
    let tableResize: TableResize;
    let node: HTMLDivElement;

    beforeEach(() => {
        document.body.innerHTML = '';
        node = document.createElement('div');
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
        div?.parentNode?.removeChild(div);
        node.parentElement?.removeChild(node);
    });

    it('Display component on mouse move inside table', () => {
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
            if (tableSelector) {
                expect(tableSelector).toBeDefined();
            }
        });
    });

    it('Do not display component, top of table is no visible in the container.', () => {
        //Arrange
        editor.setContent(
            `<table id='table1'><tr><td>a</td><td>w</td></tr><tr><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table><div style='height: 300px'>`
        );
        node.style.height = '100px';
        node.style.overflowX = 'auto';
        node.scrollTop = 15;
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);
        editor.focus();
        editor.select(target);

        //Act
        simulateMouseEvent('mousemove', target2);

        //Assert
        editor.runAsync(editor => {
            const tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
            expect(tableSelector).toBeNull();
        });
    });

    it('Do not display component, Top of table is no visible in the scroll container.', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);

        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);
        editor.setContent(
            `<table id='table1'><tr><td>a</td><td>w</td></tr><tr><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table><div style='height: 300px'>`
        );
        scrollContainer.style.height = '100px';
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.scrollTop = 15;
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);
        editor.focus();
        editor.select(target);

        //Act
        simulateMouseEvent('mousemove', target2);

        //Assert
        const tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
        expect(tableSelector).toBeNull();
    });

    it('Display component, Top of table is visible in the scroll container scrolled down.', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        scrollContainer.innerHTML = '<div style="height: 300px"></div>';
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);

        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);
        editor.setContent(
            `<table id='table1'><tr><td>a</td><td>w</td></tr><tr><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table>`
        );
        scrollContainer.style.height = '100px';
        scrollContainer.style.overflowX = 'auto';
        scrollContainer.scrollTop = 50;
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);
        editor.focus();
        editor.select(target);

        //Act
        simulateMouseEvent('mousemove', target2);

        //Assert
        editor.runAsync(editor => {
            const tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
            expect(tableSelector).toBeDefined();
        });
    });

    it('Scroll container equals null, display component', () => {
        //Arrange
        spyOn(editor, 'getScrollContainer').and.returnValue(null);
        editor.setContent(
            `<table id='table1'><tr><td>a</td><td>w</td></tr><tr><td id=${targetId}>a</td><td id=${targetId2}>w</td></tr></table><div style='height: 300px'>`
        );
        node.style.height = '100px';
        node.style.overflowX = 'auto';
        node.scrollTop = 15;
        const target = document.getElementById(targetId);
        const target2 = document.getElementById(targetId2);
        editor.focus();
        editor.select(target);
        //Act
        simulateMouseEvent('mousemove', target2);

        //Assert
        editor.runAsync(editor => {
            const tableSelector = editor.getDocument().getElementById(TABLE_SELECTOR_ID);
            expect(tableSelector).toBeDefined();
        });
    });

    it('On click event', () => {
        editor.setContent(
            `<div><table id=${targetId} cellspacing="0" cellpadding="1" data-rooster-table-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0}" style="border-collapse: collapse;" id="tableSelected0"><tbody><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table><br></div>`
        );
        const table = document.getElementById(targetId) as HTMLTableElement;

        const tableEditor = new TableEditor(editor, table, () => {});

        tableEditor.onSelect(table);

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
