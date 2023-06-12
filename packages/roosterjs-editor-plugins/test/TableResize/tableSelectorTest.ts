import createTableSelector from '../../lib/plugins/TableResize/editors/TableSelector';
import TableEditor from '../../lib/plugins/TableResize/editors/TableEditor';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, IEditor, SelectionRangeTypes } from 'roosterjs-editor-types';
import { TableResize } from '../../lib/TableResize';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

describe('Table Selector Tests', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
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
        runTest(0, true);
    });

    it('Do not display component, top of table is no visible in the container.', () => {
        //Arrange
        runTest(15, false);
    });

    it('Do not display component, Top of table is no visible in the scroll container.', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);
        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);

        runTest(15, false);
    });

    it('Display component, Top of table is visible in the scroll container scrolled down.', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        scrollContainer.innerHTML = '<div style="height: 300px"></div>';
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);
        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);

        runTest(0, true);
    });

    it('On click event', () => {
        editor.setContent(
            `<div><table id=${targetId} cellspacing="0" cellpadding="1" data-rooster-table-info="{&quot;topBorderColor&quot;:&quot;#ABABAB&quot;,&quot;bottomBorderColor&quot;:&quot;#ABABAB&quot;,&quot;verticalBorderColor&quot;:&quot;#ABABAB&quot;,&quot;hasHeaderRow&quot;:false,&quot;hasFirstColumn&quot;:false,&quot;hasBandedRows&quot;:false,&quot;hasBandedColumns&quot;:false,&quot;bgColorEven&quot;:null,&quot;bgColorOdd&quot;:&quot;#ABABAB20&quot;,&quot;headerRowColor&quot;:&quot;#ABABAB&quot;,&quot;tableBorderFormat&quot;:0}" style="border-collapse: collapse;" id="tableSelected0"><tbody><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr><tr><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;" scope=""><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td><td style="width: 70px; border-width: 1px; border-style: solid; border-color: rgb(171, 171, 171); background-color: transparent;"><br></td></tr></tbody></table><br></div>`
        );
        const table = document.getElementById(targetId) as HTMLTableElement;

        const tableEditor = new TableEditor(
            editor,
            table,
            () => {},
            () => true
        );

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

    function runTest(scrollTop: number, isNotNull: boolean | null) {
        //Arrange
        editor.setContent(
            '<table id="table1"><tr><td>a</td><td>w</td></tr><tr><td>a</td><td>w</td></tr></table><div style="height: 300px">'
        );

        node.style.height = '100px';
        node.style.overflowX = 'auto';
        node.scrollTop = scrollTop;
        const target = document.getElementById('table1');
        editor.focus();

        //Act
        const result = createTableSelector(
            target as HTMLTableElement,
            1,
            editor,
            () => {},
            () => () => {},
            () => {},
            <EventTarget>node
        );

        //Assert
        if (!isNotNull) {
            expect(result).toBeNull();
        } else {
            expect(result).toBeDefined();
        }
    }
});
