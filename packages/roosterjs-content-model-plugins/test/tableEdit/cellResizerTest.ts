import {
    ContentModelTable,
    ContentModelTableCell,
    EditorOptions,
    IEditor,
} from 'roosterjs-content-model-types';
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
    let cmTable: ContentModelTable;

    beforeEach(() => {
        document.body.innerHTML = '';
        node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        tableEdit = new TableEditPlugin();
        cmTable = getModelTable(targetId);

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

    function createTableWithInterruptedFirstBorder() {
        const table = document.createElement('table');
        const rows = Array.from({ length: 4 }, (_, rowIndex) => {
            const tr = table.insertRow();
            const cells = Array.from(
                { length: 4 },
                (_, columnIndex): ContentModelTableCell => {
                    const spanLeft = rowIndex == 1 && columnIndex == 1;
                    const td = spanLeft ? undefined : tr.insertCell();

                    if (rowIndex == 1 && columnIndex == 0 && td) {
                        td.colSpan = 2;
                    }

                    return {
                        blockGroupType: 'TableCell',
                        blocks: [],
                        format: {},
                        spanLeft,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                        cachedElement: td,
                    };
                }
            );

            return { height: 50, format: {}, cells };
        });
        const model: ContentModelTable = {
            blockType: 'Table',
            rows,
            widths: [50, 50, 50, 50],
            format: {},
            dataset: {},
        };

        node.appendChild(table);
        return { model, table };
    }

    function resizeInterruptedFirstBorder(anchorRow: number) {
        const { model, table } = createTableWithInterruptedFirstBorder();
        const context: CellResizerContext = {
            editor,
            td: model.rows[anchorRow].cells[0].cachedElement!,
            table,
            isRTL: false,
            zoomScale: 1,
            onStart: () => {},
            originalWidth: 0,
        };
        const initValue: CellResizerInitValue = {
            cmTable: model,
            anchorColumn: 0,
            nextColumn: 1,
            anchorRow,
            anchorRowHeight: 50,
            allWidths: [...model.widths],
        };

        expect(onDraggingVertical(context, {} as MouseEvent, initValue, 10)).toBeTrue();
        expect(model.widths).toEqual([50, 10, 40, 50, 50]);

        return { model, table };
    }

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
            originalWidth: 0,
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

        function resizeRowTest(
            growth: number,
            cellRow: number,
            cellColumn: number,
            nextColumn: number
        ) {
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
                nextColumn,
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
                originalWidth: 0,
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
            resizeRowTest(1, 0, 0, 1);
        });

        it('increases the height of the last row', () => {
            const MODEL_TABLE = cmTable;
            resizeRowTest(1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1, -1);
        });

        it('decreases the height of the first row', () => {
            resizeRowTest(-1, 0, 0, 1);
        });

        it('decreases the height of the last row', () => {
            const MODEL_TABLE = cmTable;
            resizeRowTest(-1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1, -1);
        });

        /************************ Resizing column related tests ************************/

        function resizeColumnTest(
            growth: number,
            cellRow: number,
            cellColumn: number,
            nextColumn: number
        ) {
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
                nextColumn,
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
                originalWidth: 0,
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
            resizeColumnTest(1, 0, 0, 1);
        });

        it('increases the width of the last column', () => {
            const MODEL_TABLE = cmTable;
            resizeColumnTest(1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1, -1);
        });

        it('decreases the width of the first column', () => {
            resizeColumnTest(-1, 0, 0, 1);
        });

        it('decreases the width of the last column', () => {
            const MODEL_TABLE = cmTable;
            resizeColumnTest(-1, MODEL_TABLE.rows.length - 1, MODEL_TABLE.widths.length - 1, -1);
        });

        it('resizes only the border above a horizontally merged cell', () => {
            const { model, table } = resizeInterruptedFirstBorder(0);

            expect(model.rows.map(row => row.cells.map(cell => cell.spanLeft))).toEqual([
                [false, true, false, false, false],
                [false, true, true, false, false],
                [false, false, true, false, false],
                [false, false, true, false, false],
            ]);
            expect(Array.from(table.rows).map(row => row.cells[0].colSpan)).toEqual([2, 3, 1, 1]);
            expect(Array.from(table.rows).map(row => row.cells[1].colSpan)).toEqual([1, 1, 2, 2]);
            expect(table.rows[0].cells[0].getBoundingClientRect().right).toBeGreaterThan(
                table.rows[2].cells[0].getBoundingClientRect().right
            );
            expect(table.rows[2].cells[0].getBoundingClientRect().right).toEqual(
                table.rows[3].cells[0].getBoundingClientRect().right
            );
        });

        it('resizes an interrupted border again after recreating the drag state', () => {
            const { model, table } = resizeInterruptedFirstBorder(0);
            const context: CellResizerContext = {
                editor,
                td: model.rows[0].cells[0].cachedElement!,
                table,
                isRTL: false,
                zoomScale: 1,
                onStart: () => {},
                originalWidth: 0,
            };
            const initValue: CellResizerInitValue = {
                cmTable: model,
                anchorColumn: 1,
                nextColumn: 2,
                anchorRow: 0,
                anchorRowHeight: 50,
                allWidths: [...model.widths],
            };
            const previousBorder = table.rows[0].cells[0].getBoundingClientRect().right;

            expect(onDraggingVertical(context, {} as MouseEvent, initValue, 10)).toBeTrue();
            expect(model.widths).toEqual([50, 20, 30, 50, 50]);
            expect(table.rows[0].cells[0].getBoundingClientRect().right).toBeGreaterThan(
                previousBorder
            );
            expect(table.rows[2].cells[0].getBoundingClientRect().right).toEqual(
                table.rows[3].cells[0].getBoundingClientRect().right
            );
        });

        it('resizes only the connected borders below a horizontally merged cell', () => {
            const { model, table } = resizeInterruptedFirstBorder(2);

            expect(model.rows.map(row => row.cells.map(cell => cell.spanLeft))).toEqual([
                [false, false, true, false, false],
                [false, true, true, false, false],
                [false, true, false, false, false],
                [false, true, false, false, false],
            ]);
            expect(Array.from(table.rows).map(row => row.cells[0].colSpan)).toEqual([1, 3, 2, 2]);
            expect(Array.from(table.rows).map(row => row.cells[1].colSpan)).toEqual([2, 1, 1, 1]);
            expect(table.rows[2].cells[0].getBoundingClientRect().right).toBeGreaterThan(
                table.rows[0].cells[0].getBoundingClientRect().right
            );
            expect(table.rows[2].cells[0].getBoundingClientRect().right).toEqual(
                table.rows[3].cells[0].getBoundingClientRect().right
            );
        });
    });
});
