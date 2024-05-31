import * as getIntersectedRect from '../../lib/pluginUtils/Rect/getIntersectedRect';
import { Editor } from 'roosterjs-content-model-core';
import { getModelTable } from './tableData';
import {
    HORIZONTAL_INSERTER_ID,
    TableInsertHandler,
    VERTICAL_INSERTER_ID,
    createTableInserter,
} from '../../lib/tableEdit/editors/features/TableInserter';
import { ContentModelTable, EditorOptions, IEditor } from 'roosterjs-content-model-types';

import { getCurrentTable, getTableColumns, getTableRows } from './TableEditTestHelper';

describe('Table Inserter tests', () => {
    let editor: IEditor;
    let id = 'tableInserterContainerId';
    let targetId = 'tableInserterTestId';
    let tInserter: TableInsertHandler;
    let node: HTMLDivElement;

    function initialize(table: ContentModelTable) {
        document.body.innerHTML = '';
        node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);

        let options: EditorOptions = {
            plugins: [],
            initialModel: {
                blockGroupType: 'Document',
                blocks: [{ ...table }],
                format: {},
            },
        };

        editor = new Editor(node, options);
    }

    afterEach(() => {
        !editor.isDisposed && editor.dispose();
        tInserter && tInserter.dispose();
        const div = document.getElementById(id);
        div?.parentNode?.removeChild(div);
        node.parentElement?.removeChild(node);
    });

    function runInserterTest(
        table: ContentModelTable,
        inserterType: string,
        colIndex: number,
        rowIndex: number
    ) {
        //Arrange
        initialize(table);
        const nodeHeight = 1000;
        const nodeWidth = 1000;
        node.style.height = `${nodeHeight}px`;
        node.style.width = `${nodeWidth}px`;
        node.style.overflowX = 'auto';
        node.scrollTop = 0;
        const target = document.getElementById(targetId);
        editor.focus();

        if (!target) {
            fail('Table not found');
            return;
        }

        const targetTd = (target as HTMLTableElement).rows[rowIndex].cells[colIndex];
        const div = document.createElement('div');
        const onInsertSpy = jasmine.createSpy('onInsert');
        const beforeTable = getCurrentTable(editor);
        const rows = getTableRows(beforeTable);
        const cols = getTableColumns(beforeTable);
        tInserter = new TableInsertHandler(
            div,
            targetTd,
            target as HTMLTableElement,
            inserterType == HORIZONTAL_INSERTER_ID,
            editor,
            onInsertSpy
        );

        //Act
        div.click();

        //Assert
        expect(onInsertSpy).toHaveBeenCalled();
        const afterTable = getCurrentTable(editor);
        const newRows = getTableRows(afterTable);
        const newCols = getTableColumns(afterTable);
        expect(newRows).toBe(inserterType == VERTICAL_INSERTER_ID ? rows : rows + 1);
        expect(newCols).toBe(inserterType == HORIZONTAL_INSERTER_ID ? cols : cols + 1);
    }

    it('adds a new column', () => {
        runInserterTest(getModelTable(targetId), VERTICAL_INSERTER_ID, 0, 0);
    });

    it('adds a new row', () => {
        runInserterTest(getModelTable(targetId), HORIZONTAL_INSERTER_ID, 0, 0);
    });

    it('Customize table inserter', () => {
        initialize(getModelTable(targetId));
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
        initialize(getModelTable(targetId));
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
