import * as getIntersectedRect from '../../lib/pluginUtils/Rect/getIntersectedRect';
import { ContentModelTable, EditorOptions, IEditor } from 'roosterjs-content-model-types';
import { Editor } from 'roosterjs-content-model-core';
import { getCMTableFromTable } from '../../lib/tableEdit/editors/utils/getTableFromContentModel';
import { getCurrentTable, getTableRectSet, Position, resizeDirection } from './TableEditTestHelper';
import { getModelTable } from './tableData';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    createTableResizer,
    TableResizerInitValue,
    onDragging,
    onDragStart,
    TableResizerContext,
    onDragEnd,
} from '../../lib/tableEdit/editors/features/TableResizer';

describe('Table Resizer tests', () => {
    let editor: IEditor;
    let id = 'tableResizerContainerId';
    let targetId = 'tableResizerTestId';
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
        tableEdit.dispose();
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

        const div = document.createElement('div');
        const onStartSpy = jasmine.createSpy('onStart');
        const context: TableResizerContext = {
            table: target as HTMLTableElement,
            isRTL: false,
            zoomScale: 1,
            onStart: onStartSpy,
            onEnd: () => false,
            div: div,
            editor: editor,
            contentDiv: node,
        };

        const editorCMTable = getCMTableFromTable(editor, target as HTMLTableElement);

        const heights: number[] = [];
        editorCMTable?.rows.forEach(row => {
            heights.push(row.height);
        });
        const tableRect = target.getBoundingClientRect();

        //Act
        const initvalue = onDragStart(context, {} as MouseEvent);

        //Assert
        expect(onStartSpy).toHaveBeenCalled();
        expect(initvalue.cmTable).toEqual(editorCMTable);
        expect(initvalue.originalRect).toEqual(tableRect);
        expect(initvalue.originalHeights).toEqual(heights);
        expect(initvalue.originalWidths).toEqual(editorCMTable.widths);
    });

    describe('Resize - onDragging', () => {
        function resizeWholeTableTest(growth: number, direction: resizeDirection) {
            //Arrange
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

            const div = document.createElement('div');

            const context: TableResizerContext = {
                table: target as HTMLTableElement,
                isRTL: false,
                zoomScale: 1,
                onStart: () => {},
                onEnd: () => false,
                div: div,
                editor: editor,
                contentDiv: node,
            };

            const heights: number[] = [];
            cmTable?.rows.forEach(row => {
                heights.push(row.height);
            });
            const tableRect = target.getBoundingClientRect();

            const initValue: TableResizerInitValue = {
                originalRect: tableRect,
                originalHeights: heights,
                originalWidths: cmTable.widths,
                cmTable: cmTable,
            };
            const beforeSize = getTableRectSet(getCurrentTable(editor));
            const delta = 10 * growth;
            let mouseEnd: Position = { x: 0, y: 0 };
            switch (direction) {
                case 'horizontal':
                    mouseEnd = { x: 3 * delta, y: 0 };
                    break;
                case 'vertical':
                    mouseEnd = { x: 0, y: 3 * delta };
                    break;
                case 'both':
                    mouseEnd = { x: 3 * delta, y: 3 * delta };
                    break;
            }

            //Act
            const result = onDragging(context, {} as MouseEvent, initValue, mouseEnd.x, mouseEnd.y);

            //Assert
            expect(result).toBeTrue();
            const afterSize = getTableRectSet(getCurrentTable(editor));
            compareTableRects(beforeSize, afterSize, growth, direction);
        }

        function verifyTableRectChange(
            rect1: DOMRect,
            rect2: DOMRect,
            growth: number,
            direction: resizeDirection
        ): boolean {
            switch (direction) {
                case 'horizontal':
                    return growth > 0 ? rect1.width < rect2.width : rect1.width > rect2.width;
                case 'vertical':
                    return growth > 0 ? rect1.height < rect2.height : rect1.height > rect2.height;
                case 'both':
                    return growth > 0
                        ? rect1.width < rect2.width && rect1.height < rect2.height
                        : rect1.width > rect2.width && rect1.height > rect2.height;
            }
        }

        function verifyCellRectChange(
            rect1: DOMRect,
            rect2: DOMRect,
            growth: number,
            direction: resizeDirection
        ): boolean {
            switch (direction) {
                case 'horizontal':
                    return rect1.top == rect2.top && rect1.bottom == rect2.bottom && growth > 0
                        ? rect1.left <= rect2.left && rect1.right <= rect2.right
                        : rect1.left >= rect2.left && rect1.right >= rect2.right;
                case 'vertical':
                    return rect1.left == rect2.left && rect1.right == rect2.right && growth > 0
                        ? rect1.top <= rect2.top && rect1.bottom <= rect2.bottom
                        : rect1.top >= rect2.top && rect1.bottom >= rect2.bottom;
                case 'both':
                    return growth > 0
                        ? rect1.left <= rect2.left &&
                              rect1.right <= rect2.right &&
                              rect1.top <= rect2.top &&
                              rect1.bottom <= rect2.bottom
                        : rect1.left >= rect2.left &&
                              rect1.right >= rect2.right &&
                              rect1.top >= rect2.top &&
                              rect1.bottom >= rect2.bottom;
            }
        }

        function compareTableRects(
            beforeTableRectSet1: DOMRect[],
            afterTableRectSet2: DOMRect[],
            growth: number,
            direction: resizeDirection
        ) {
            expect(beforeTableRectSet1.length).toBe(afterTableRectSet2.length);
            beforeTableRectSet1.forEach((rect, i) => {
                i == 0
                    ? expect(
                          verifyTableRectChange(rect, afterTableRectSet2[i], growth, direction)
                      ).toBe(true) // Verify a change to whole table size
                    : expect(
                          verifyCellRectChange(rect, afterTableRectSet2[i], growth, direction)
                      ).toBe(
                          true // Verify a change to each cell size
                      );
            });
        }

        it('increases the width of the table', () => {
            resizeWholeTableTest(1, 'horizontal');
        });

        it('increases the height of the table', () => {
            resizeWholeTableTest(1, 'vertical');
        });

        it('increases the width and height of the table', () => {
            resizeWholeTableTest(1, 'both');
        });

        it('decreases the width of the table', () => {
            resizeWholeTableTest(-1, 'horizontal');
        });

        it('decreases the height of the table', () => {
            resizeWholeTableTest(-1, 'vertical');
        });

        it('decreases the width and height of the table', () => {
            resizeWholeTableTest(-1, 'both');
        });
    });

    it('Resize - onDragEnd', () => {
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

        const div = document.createElement('div');
        const styleSpy = spyOnProperty(div, 'style').and.callThrough();
        const onEndSpy = jasmine.createSpy('onEnd');
        const context: TableResizerContext = {
            table: target as HTMLTableElement,
            isRTL: false,
            zoomScale: 1,
            onStart: () => {},
            onEnd: onEndSpy,
            div: div,
            editor: editor,
            contentDiv: node,
        };

        //Act
        const result = onDragEnd(context, {} as MouseEvent, undefined);

        //Assert
        expect(onEndSpy).toHaveBeenCalled();
        expect(result).toBeFalse();
        expect(styleSpy).toHaveBeenCalled();
    });

    it('Customize table resizer', () => {
        spyOn(getIntersectedRect, 'getIntersectedRect').and.returnValue({
            bottom: 10,
            left: 10,
            right: 10,
            top: 10,
        });

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('changeCb');
        //Act
        const result = createTableResizer(
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
            editor,
            false,
            () => {},
            () => false,
            null,
            undefined,
            (editorType, element) => {
                if (element && editorType == 'TableResizer') {
                    changeCb();
                }
                return () => disposer();
            }
        );

        result?.featureHandler?.dispose();

        expect(disposer).toHaveBeenCalled();
        expect(changeCb).toHaveBeenCalled();
    });

    it('Customize table resizer, do not customize wrong editor type', () => {
        spyOn(getIntersectedRect, 'getIntersectedRect').and.returnValue({
            bottom: 10,
            left: 10,
            right: 10,
            top: 10,
        });

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('changeCb');
        //Act
        const result = createTableResizer(
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
            editor,
            false,
            () => {},
            () => false,
            null,
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
