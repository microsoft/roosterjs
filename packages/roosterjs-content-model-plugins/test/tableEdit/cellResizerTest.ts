import { ContentModelTable, EditorOptions, IEditor } from 'roosterjs-content-model-types';
import { Editor } from 'roosterjs-content-model-core';
import { getCMTableFromTable } from '../../lib/tableEdit/editors/utils/getTableFromContentModel';
import { getCurrentTable } from './TableEditTestHelper';
import { getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    CellResizerContext,
    CellResizerInitValue,
    onDragStart,
    onDraggingHorizontal,
    onDraggingVertical,
} from '../../lib/tableEdit/editors/features/CellResizer';

describe('Cell Resizer tests', () => {
    let editor: IEditor;
    let id = 'tableCellResizerContainerId';
    let targetId = 'tableCellResizerTestId';
    let tableEdit: TableEditPlugin;
    let node: HTMLDivElement;
    const cmTable: ContentModelTable = getModelTable(targetId);

    beforeEach(() => {
        document.body.innerHTML = '';
        node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        tableEdit = new TableEditPlugin();

        let options: EditorOptions = {
            plugins: [tableEdit],
            initialModel: {
                blockGroupType: 'Document',
                blocks: [{ ...cmTable }],
                format: {},
            },
        };

        editor = new Editor(node, options);
    });

    afterEach(() => {
        editor.dispose();
        const div = document.getElementById(id);
        div?.parentNode?.removeChild(div);
        node.parentElement?.removeChild(node);
    });

    it('Resize - onDragStart', () => {
        //Arrange
        node.style.height = '500px';
        node.style.overflowX = 'auto';
        node.scrollTop = 0;
        const target = document.getElementById(targetId);
        editor.focus();

        if (!target) {
            fail('Table not found');
            return;
        }

        const targetTd = (target as HTMLTableElement).rows[0].cells[0];

        const onStartSpy = jasmine.createSpy('onStart');
        const context: CellResizerContext = {
            editor: editor,
            td: targetTd as HTMLTableCellElement,
            table: target as HTMLTableElement,
            isRTL: false,
            zoomScale: 1,
            onStart: onStartSpy,
        };
        const editorCMTable = getCMTableFromTable(editor, target as HTMLTableElement);

        //Act
        const initvalue = onDragStart(context, {} as MouseEvent);

        //Assert
        expect(onStartSpy).toHaveBeenCalled();
        expect(initvalue.cmTable).toEqual(editorCMTable);
        expect(initvalue.allWidths).toEqual(editorCMTable.widths);
        expect(initvalue.anchorColumn).toEqual(0);
        expect(initvalue.anchorRow).toEqual(0);
        expect(initvalue.anchorRowHeight).toEqual(editorCMTable.rows[0].height);
    });

    describe('Resize - onDragging', () => {
        /************************ Resizing row related tests ************************/

        function resizeRowTest(growth: number, cellRow: number, cellColumn: number) {
            //Arrange
            node.style.height = '500px';
            node.style.width = '500px';
            node.style.overflowX = 'auto';
            node.scrollTop = 0;
            const target = document.getElementById(targetId);
            editor.focus();

            if (!target) {
                fail('Table not found');
                return;
            }

            const initValue: CellResizerInitValue = {
                cmTable: cmTable,
                anchorColumn: cellColumn,
                anchorRow: cellRow,
                anchorRowHeight: cmTable.rows[cellRow].height,
                allWidths: cmTable.widths,
            };

            const targetTd = (target as HTMLTableElement).rows[cellRow].cells[cellColumn];

            const onStartSpy = jasmine.createSpy('onStart');
            const context: CellResizerContext = {
                editor: editor,
                td: targetTd as HTMLTableCellElement,
                table: target as HTMLTableElement,
                isRTL: false,
                zoomScale: 1,
                onStart: onStartSpy,
            };
            const delta = 10 * growth;
            const beforeHeight = getCurrentTable(editor).rows[cellRow].getBoundingClientRect()
                .height;

            //Act
            const dragHResult = onDraggingHorizontal(
                context,
                {} as MouseEvent,
                initValue,
                0,
                delta
            );

            //Assert
            const afterHeight = getCurrentTable(editor).rows[cellRow].getBoundingClientRect()
                .height;
            expect(dragHResult).toBeTrue();
            growth > 0
                ? expect(afterHeight).toBeGreaterThan(beforeHeight)
                : expect(afterHeight).toBeLessThan(beforeHeight);
        }

        it('increases the height of the first row', () => {
            resizeRowTest(1, 0, 0);
        });

        it('increases the height of the last row', () => {
            const MODEL_TABLE = cmTable;
            resizeRowTest(1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
        });

        it('decreases the height of the first row', () => {
            resizeRowTest(-1, 0, 0);
        });

        it('decreases the height of the last row', () => {
            const MODEL_TABLE = cmTable;
            resizeRowTest(-1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
        });

        /************************ Resizing column related tests ************************/

        function resizeColumnTest(growth: number, cellRow: number, cellColumn: number) {
            //Arrange
            node.style.height = '500px';
            node.style.width = '500px';
            node.style.overflowX = 'auto';
            node.scrollTop = 0;
            const target = document.getElementById(targetId);
            editor.focus();

            if (!target) {
                fail('Table not found');
                return;
            }

            const initValue: CellResizerInitValue = {
                cmTable: cmTable,
                anchorColumn: cellColumn,
                anchorRow: cellRow,
                anchorRowHeight: cmTable.rows[cellRow].height,
                allWidths: cmTable.widths,
            };

            const targetTd = (target as HTMLTableElement).rows[cellRow].cells[cellColumn];

            const onStartSpy = jasmine.createSpy('onStart');
            const context: CellResizerContext = {
                editor: editor,
                td: targetTd as HTMLTableCellElement,
                table: target as HTMLTableElement,
                isRTL: false,
                zoomScale: 1,
                onStart: onStartSpy,
            };
            const delta = 10 * growth;
            const beforeWidth = getCurrentTable(editor).rows[cellRow].cells[
                cellColumn
            ].getBoundingClientRect().width;
            const beforeNextWidth =
                cellColumn < cmTable.widths.length - 1
                    ? getCurrentTable(editor).rows[cellRow].cells[
                          cellColumn + 1
                      ].getBoundingClientRect().width
                    : undefined;

            //Act
            const dragVResult = onDraggingVertical(context, {} as MouseEvent, initValue, delta);

            //Assert
            const afterWidth = getCurrentTable(editor).rows[cellRow].cells[
                cellColumn
            ].getBoundingClientRect().width;
            const afterNextWidth =
                cellColumn < cmTable.widths.length - 1
                    ? getCurrentTable(editor).rows[cellRow].cells[
                          cellColumn + 1
                      ].getBoundingClientRect().width
                    : undefined;
            expect(dragVResult).toBeTrue();
            growth > 0
                ? expect(afterWidth).toBeGreaterThan(beforeWidth)
                : expect(afterWidth).toBeLessThan(beforeWidth);

            if (beforeNextWidth && afterNextWidth) {
                growth > 0
                    ? expect(afterNextWidth).toBeLessThan(beforeNextWidth)
                    : expect(afterNextWidth).toBeGreaterThan(beforeNextWidth);
            }
        }

        it('increases the width of the first column', () => {
            resizeColumnTest(1, 0, 0);
        });

        it('increases the width of the last column', () => {
            const MODEL_TABLE = cmTable;
            resizeColumnTest(1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
        });

        it('decreases the width of the first column', () => {
            resizeColumnTest(-1, 0, 0);
        });

        it('decreases the width of the last column', () => {
            const MODEL_TABLE = cmTable;
            resizeColumnTest(-1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1);
        });
    });
});
