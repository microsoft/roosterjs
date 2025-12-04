import { afterTableTest, beforeTableTest } from './TableEditTestHelper';
import { IEditor, TableSelection } from 'roosterjs-content-model-types';
import { OnTableEditorCreatedCallback } from '../../lib/tableEdit/OnTableEditorCreatedCallback';
import {
    TableRowColumnSelectorContext,
    TableRowColumnSelectorInitValue,
    createTableRowColumnSelector,
    onDragEnd,
    onDragStart,
    onDragging,
} from '../../lib/tableEdit/editors/features/TableRowColumnSelector';

describe('TableRowColumnSelector Tests', () => {
    let editor: IEditor;
    let id = 'tableRowColumnSelectorTestId';
    let targetId = 'tableRowColumnSelectorContainerId';
    let node: HTMLDivElement;

    beforeEach(() => {
        node = document.createElement('div');
        node.id = targetId;
        document.body.appendChild(node);

        ({ editor } = beforeTableTest(id, targetId));
    });

    afterEach(() => {
        afterTableTest(editor, editor as any, id);
        node?.remove();
    });

    function createTestTable(): HTMLTableElement {
        const table = document.createElement('table');
        table.style.width = '300px';
        table.style.height = '200px';
        table.style.position = 'absolute';
        table.style.top = '100px';
        table.style.left = '100px';

        for (let i = 0; i < 3; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                const td = document.createElement('td');
                td.textContent = `Cell ${i + 1},${j + 1}`;
                td.style.width = '100px';
                td.style.height = '67px';
                td.style.border = '1px solid black';
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        document.body.appendChild(table);
        return table;
    }

    describe('createTableRowColumnSelector', () => {
        let table: HTMLTableElement;
        let anchorContainer: HTMLDivElement;

        beforeEach(() => {
            table = createTestTable();
            anchorContainer = document.createElement('div');
            document.body.appendChild(anchorContainer);
        });

        afterEach(() => {
            table?.remove();
            anchorContainer?.remove();
        });

        it('should create row selector successfully', () => {
            const onTableEditorCreated: OnTableEditorCreatedCallback = jasmine
                .createSpy('onTableEditorCreated')
                .and.returnValue(() => {});

            const result = createTableRowColumnSelector(
                editor,
                table,
                true, // isRowSelector
                anchorContainer,
                onTableEditorCreated
            );

            expect(result).not.toBeNull();
            expect(result!.div).toBeDefined();
            expect(result!.featureHandler).toBeDefined();
            expect(result!.node).toBe(table);
            if (result!.div) {
                expect(onTableEditorCreated).toHaveBeenCalledWith('TableRowSelector', result!.div);
            }
        });

        it('should create column selector successfully', () => {
            const onTableEditorCreated: OnTableEditorCreatedCallback = jasmine
                .createSpy('onTableEditorCreated')
                .and.returnValue(() => {});

            const result = createTableRowColumnSelector(
                editor,
                table,
                false, // isRowSelector
                anchorContainer,
                onTableEditorCreated
            );

            expect(result).not.toBeNull();
            expect(result!.div).toBeDefined();
            expect(result!.featureHandler).toBeDefined();
            expect(result!.node).toBe(table);
            if (result!.div) {
                expect(onTableEditorCreated).toHaveBeenCalledWith(
                    'TableColumnSelector',
                    result!.div
                );
            }
        });

        it('should append selector to anchorContainer', () => {
            const result = createTableRowColumnSelector(editor, table, true, anchorContainer);

            expect(result!.div).toBeDefined();
            if (result!.div) {
                expect(result!.div.parentElement).toBe(anchorContainer);
            }
        });

        it('should append selector to document.body when no anchorContainer provided', () => {
            const result = createTableRowColumnSelector(editor, table, false);

            expect(result!.div).toBeDefined();
            if (result!.div) {
                expect(result!.div.parentElement).toBe(document.body);
            }
        });

        it('should return null when table has no bounding rect', () => {
            // Create a table that's not in the DOM
            const hiddenTable = document.createElement('table');

            const result = createTableRowColumnSelector(editor, hiddenTable, true, anchorContainer);

            expect(result).toBeNull();
        });

        it('should set correct styles for row selector', () => {
            const result = createTableRowColumnSelector(
                editor,
                table,
                true, // isRowSelector
                anchorContainer
            );

            const div = result?.div;
            expect(div).toBeDefined();

            const style = div!.style;
            expect(style.position).toBe('fixed');
            expect(style.width).toBe('16px');
            expect(style.backgroundColor).toBe('transparent');
            expect(style.pointerEvents).toBe('auto');
            expect(style.zIndex).toBe('1000');
            expect(style.cursor).toContain('url("data:image/svg+xml;base64,');
        });

        it('should set correct styles for column selector', () => {
            const result = createTableRowColumnSelector(
                editor,
                table,
                false, // isRowSelector
                anchorContainer
            );

            const div = result?.div;
            expect(div).toBeDefined();

            const style = div!.style;
            expect(style.position).toBe('fixed');
            expect(style.height).toBe('16px');
            expect(style.backgroundColor).toBe('transparent');
            expect(style.pointerEvents).toBe('auto');
            expect(style.zIndex).toBe('1000');
            expect(style.cursor).toContain('url("data:image/svg+xml;base64,');
        });
    });

    describe('onDragStart', () => {
        let table: HTMLTableElement;
        let context: TableRowColumnSelectorContext;
        let mockEvent: MouseEvent;

        beforeEach(() => {
            table = createTestTable();

            const div = document.createElement('div');
            context = {
                table,
                zoomScale: 1,
                editor,
                div,
                isRow: true,
            };

            // Mock getBoundingClientRect for table cells
            spyOn(table.rows[0].cells[0], 'getBoundingClientRect').and.returnValue({
                top: 100,
                bottom: 167,
                left: 100,
                right: 200,
                width: 100,
                height: 67,
            } as DOMRect);

            spyOn(table.rows[1].cells[0], 'getBoundingClientRect').and.returnValue({
                top: 167,
                bottom: 234,
                left: 100,
                right: 200,
                width: 100,
                height: 67,
            } as DOMRect);

            mockEvent = new MouseEvent('mousedown', {
                clientX: 150,
                clientY: 130, // Should be in first row
            });

            spyOn(editor, 'setDOMSelection');
        });

        afterEach(() => {
            table?.remove();
        });

        it('should calculate correct start index for row selection', () => {
            context.isRow = true;
            const result = onDragStart(context, mockEvent);

            expect(result.startIndex).toBe(0); // First row
            expect(result.parsedTable).toBeDefined();
            expect(result.initialSelection?.type).toBe('table');
            expect(editor.setDOMSelection).toHaveBeenCalledWith(null);
        });

        it('should calculate correct start index for column selection', () => {
            context.isRow = false;
            // Mock first row cells for column detection
            spyOn(table.rows[0].cells[1], 'getBoundingClientRect').and.returnValue({
                top: 100,
                bottom: 167,
                left: 200,
                right: 300,
                width: 100,
                height: 67,
            } as DOMRect);

            const columnEvent = new MouseEvent('mousedown', {
                clientX: 250, // Should be in second column
                clientY: 130,
            });

            const result = onDragStart(context, columnEvent);

            expect(result.startIndex).toBe(1); // Second column
            expect(result.parsedTable).toBeDefined();
            expect(result.initialSelection?.type).toBe('table');
        });

        it('should create correct initial selection for row', () => {
            context.isRow = true;
            const result = onDragStart(context, mockEvent);

            const selection = result.initialSelection as TableSelection;
            expect(selection?.type).toBe('table');
            expect(selection?.firstRow).toBe(0);
            expect(selection?.lastRow).toBe(0);
            expect(selection?.firstColumn).toBe(0);
            expect(selection?.lastColumn).toBe(2); // 3 columns - 1
        });

        it('should create correct initial selection for column', () => {
            context.isRow = false;
            const result = onDragStart(context, mockEvent);

            const selection = result.initialSelection as TableSelection;
            expect(selection?.type).toBe('table');
            expect(selection?.firstRow).toBe(0);
            expect(selection?.lastRow).toBe(2); // 3 rows - 1
            expect(selection?.firstColumn).toBe(0);
            expect(selection?.lastColumn).toBe(0);
        });
    });

    describe('onDragging', () => {
        let table: HTMLTableElement;
        let context: TableRowColumnSelectorContext;
        let initValue: TableRowColumnSelectorInitValue;
        let mockEvent: MouseEvent;

        beforeEach(() => {
            table = createTestTable();

            const div = document.createElement('div');
            context = {
                table,
                zoomScale: 1,
                editor,
                div,
                isRow: true,
            };

            initValue = {
                cmTable: undefined,
                initialSelection: null,
                parsedTable: [
                    [{} as any, {} as any, {} as any],
                    [{} as any, {} as any, {} as any],
                    [{} as any, {} as any, {} as any],
                ],
                startIndex: 0,
            };

            // Mock getBoundingClientRect for all cells
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    spyOn(table.rows[i].cells[j], 'getBoundingClientRect').and.returnValue({
                        top: 100 + i * 67,
                        bottom: 167 + i * 67,
                        left: 100 + j * 100,
                        right: 200 + j * 100,
                        width: 100,
                        height: 67,
                    } as DOMRect);
                }
            }

            spyOn(editor, 'setDOMSelection');
        });

        afterEach(() => {
            table?.remove();
        });

        it('should return false when initValue is undefined', () => {
            const result = onDragging(context, mockEvent, undefined);
            expect(result).toBe(false);
        });

        it('should expand row selection when dragging down', () => {
            context.isRow = true;

            mockEvent = new MouseEvent('mousemove', {
                clientX: 150,
                clientY: 200, // Should be in second row
            });

            const result = onDragging(context, mockEvent, initValue);

            expect(result).toBe(true);
            expect(editor.setDOMSelection).toHaveBeenCalledWith({
                type: 'table',
                table: table,
                firstRow: 0, // min(0, 1)
                lastRow: 1, // max(0, 1)
                firstColumn: 0,
                lastColumn: 2,
            });
        });

        it('should expand column selection when dragging right', () => {
            context.isRow = false;

            mockEvent = new MouseEvent('mousemove', {
                clientX: 250, // Should be in second column
                clientY: 130,
            });

            const result = onDragging(context, mockEvent, initValue);

            expect(result).toBe(true);
            expect(editor.setDOMSelection).toHaveBeenCalledWith({
                type: 'table',
                table: table,
                firstRow: 0,
                lastRow: 2,
                firstColumn: 0, // min(0, 1)
                lastColumn: 1, // max(0, 1)
            });
        });

        it('should handle reverse selection for rows', () => {
            context.isRow = true;
            initValue.startIndex = 2; // Start from third row

            mockEvent = new MouseEvent('mousemove', {
                clientX: 150,
                clientY: 130, // Should be in first row
            });

            const result = onDragging(context, mockEvent, initValue);

            expect(result).toBe(true);
            expect(editor.setDOMSelection).toHaveBeenCalledWith({
                type: 'table',
                table: table,
                firstRow: 0, // min(2, 0)
                lastRow: 2, // max(2, 0)
                firstColumn: 0,
                lastColumn: 2,
            });
        });
    });

    describe('onDragEnd', () => {
        let table: HTMLTableElement;
        let context: TableRowColumnSelectorContext;
        let initValue: TableRowColumnSelectorInitValue;
        let mockEvent: MouseEvent;

        beforeEach(() => {
            table = createTestTable();

            const div = document.createElement('div');
            context = {
                table,
                zoomScale: 1,
                editor,
                div,
                isRow: true,
            };

            initValue = {
                cmTable: undefined,
                initialSelection: {
                    type: 'range',
                    range: document.createRange(),
                    isReverted: false,
                },
                parsedTable: [],
                startIndex: 0,
            };

            mockEvent = new MouseEvent('mouseup');
            spyOn(editor, 'getDOMSelection');
            spyOn(editor, 'setDOMSelection');
        });

        afterEach(() => {
            table?.remove();
        });

        it('should return false when initValue is undefined', () => {
            const result = onDragEnd(context, mockEvent, undefined);
            expect(result).toBe(false);
        });

        it('should restore initial selection when current selection is not table', () => {
            (editor.getDOMSelection as jasmine.Spy).and.returnValue({
                type: 'range',
                range: document.createRange(),
            });

            const result = onDragEnd(context, mockEvent, initValue);

            expect(result).toBe(true);
            expect(editor.setDOMSelection).toHaveBeenCalledWith(initValue.initialSelection);
        });

        it('should not restore selection when current selection is table', () => {
            (editor.getDOMSelection as jasmine.Spy).and.returnValue({
                type: 'table',
                table: table,
                firstRow: 0,
                lastRow: 1,
                firstColumn: 0,
                lastColumn: 2,
            });

            const result = onDragEnd(context, mockEvent, initValue);

            expect(result).toBe(true);
            expect(editor.setDOMSelection).not.toHaveBeenCalled();
        });
    });
});
