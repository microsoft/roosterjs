import * as getIntersectedRect from '../../lib/pluginUtils/Rect/getIntersectedRect';
import { DOMEventHandlerFunction, IEditor } from 'roosterjs-content-model-types';
import { getMergedFirstColumnTable, getMergedTopRowTable, getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    HORIZONTAL_INSERTER_ID,
    VERTICAL_INSERTER_ID,
    createTableInserter,
} from '../../lib/tableEdit/editors/features/TableInserter';
import {
    Position,
    afterTableTest,
    beforeTableTest,
    getCurrentTable,
    getTableColumns,
    getTableRows,
    initialize,
} from './TableEditTestHelper';

describe('Table Inserter tests', () => {
    let editor: IEditor;
    let plugin: TableEditPlugin;
    const insideTheOffset = 5;
    const TEST_ID = 'inserterTest';
    let handler: Record<string, DOMEventHandlerFunction>;

    beforeEach(() => {
        const setup = beforeTableTest(TEST_ID);
        editor = setup.editor;
        plugin = setup.plugin;
        handler = setup.handler;
    });

    afterEach(() => {
        afterTableTest(editor, plugin, TEST_ID);
    });

    function isClickInsideInserter(click: Position, rect: DOMRect) {
        return (
            click.x >= rect.left &&
            click.x <= rect.right &&
            click.y >= rect.top &&
            click.y <= rect.bottom
        );
    }

    function runInserterTest(inserterType: string, mouseEnd: Position) {
        handler.mousemove(
            new MouseEvent('mousemove', {
                clientX: mouseEnd.x,
                clientY: mouseEnd.y,
            })
        );

        const inserter = editor.getDocument().getElementById(inserterType);
        if (!!inserter) {
            const inserterRect = inserter.getBoundingClientRect();
            if (!isClickInsideInserter(mouseEnd, inserterRect)) {
                // Inserter is visible, but pointer is not over it
                return 'not clickable';
            }

            let table = getCurrentTable(editor);
            const rows = getTableRows(table);
            const cols = getTableColumns(table);
            inserter.dispatchEvent(new MouseEvent('click'));

            table = getCurrentTable(editor);
            const newRows = getTableRows(table);
            const newCols = getTableColumns(table);
            expect(newRows).toBe(inserterType == VERTICAL_INSERTER_ID ? rows : rows + 1);
            expect(newCols).toBe(inserterType == HORIZONTAL_INSERTER_ID ? cols : cols + 1);
        }
        return !!inserter ? 'found' : 'not found';
    }

    it('adds a new column if the vertical inserter is detected and clicked', () => {
        const rect = initialize(editor, getModelTable());
        const inserterFound = runInserterTest(VERTICAL_INSERTER_ID, {
            x: rect.right,
            y: rect.top - insideTheOffset,
        });
        expect(inserterFound).toBe('found');
    });

    it('adds a new row if the horizontal inserter is detected and clicked', () => {
        const rect = initialize(editor, getModelTable());
        const inserterFound = runInserterTest(HORIZONTAL_INSERTER_ID, {
            x: rect.left - insideTheOffset,
            y: rect.bottom,
        });
        expect(inserterFound).toBe('found');
    });

    it('does not add inserter if top left corner hovered', () => {
        const rect = initialize(editor, getModelTable());
        const inserterFound = runInserterTest(VERTICAL_INSERTER_ID, {
            x: rect.left - insideTheOffset,
            y: rect.top - insideTheOffset,
        });
        expect(inserterFound).toBe('not found');
    });

    it('does not add new column if top middle clicked on merged top row', () => {
        const rect = initialize(editor, getMergedTopRowTable());
        const inserterFound = runInserterTest(VERTICAL_INSERTER_ID, {
            x: (rect.right - rect.left) / 2 + 10,
            y: rect.top - insideTheOffset,
        });
        expect(inserterFound).toBe('not clickable');
    });

    it('does not add new row if left middle clicked on merged first column', () => {
        const rect = initialize(editor, getMergedFirstColumnTable());
        const inserterFound = runInserterTest(HORIZONTAL_INSERTER_ID, {
            x: rect.left - insideTheOffset,
            y: (rect.bottom - rect.top) / 2,
        });
        expect(inserterFound).toBe('not clickable');
    });

    it('Customize table inserter', () => {
        spyOn(getIntersectedRect, 'getIntersectedRect').and.returnValue({
            bottom: 10,
            left: 10,
            right: 10,
            top: 10,
        });

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('changeCb');
        //Act
        const result = createTableInserter(
            editor,
            <any>(<HTMLTableCellElement>{
                getBoundingClientRect: () => {
                    return {
                        bottom: 10,
                        height: 10,
                        left: 10,
                        right: 10,
                        top: 10,
                    };
                },
                ownerDocument: document,
            }),
            <any>{
                getBoundingClientRect: () => {
                    return {
                        bottom: 10,
                        height: 10,
                        left: 10,
                        right: 10,
                    };
                    ownerDocument: document;
                },
            },
            false,
            false,
            () => {},
            undefined,
            (editorType, element) => {
                if (element && editorType == 'VerticalTableInserter') {
                    changeCb();
                }
                return () => disposer();
            }
        );

        result?.featureHandler?.dispose();

        expect(disposer).toHaveBeenCalled();
        expect(changeCb).toHaveBeenCalled();
    });

    it('Customize table inserter, do not customize editortype is not in the cb', () => {
        spyOn(getIntersectedRect, 'getIntersectedRect').and.returnValue({
            bottom: 10,
            left: 10,
            right: 10,
            top: 10,
        });

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('changeCb');
        //Act
        const result = createTableInserter(
            editor,
            <any>(<HTMLTableCellElement>{
                getBoundingClientRect: () => {
                    return {
                        bottom: 10,
                        height: 10,
                        left: 10,
                        right: 10,
                        top: 10,
                    };
                },
                ownerDocument: document,
            }),
            <any>{
                getBoundingClientRect: () => {
                    return {
                        bottom: 10,
                        height: 10,
                        left: 10,
                        right: 10,
                    };
                    ownerDocument: document;
                },
            },
            false,
            false,
            () => {},
            undefined,
            (editorType, element) => {
                if (element && editorType == 'TableMover') {
                    changeCb();
                }
                return () => disposer();
            }
        );

        result?.featureHandler?.dispose();

        expect(disposer).toHaveBeenCalled();
        expect(changeCb).not.toHaveBeenCalled();
    });
});
