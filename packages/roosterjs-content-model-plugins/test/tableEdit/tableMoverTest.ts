import { Editor } from 'roosterjs-content-model-core';
import { EditorOptions, IEditor } from 'roosterjs-content-model-types';
import { OnTableEditorCreatedCallback } from '../../lib/tableEdit/OnTableEditorCreatedCallback';
import { TableEditor } from '../../lib/tableEdit/editors/TableEditor';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';
import {
    TableMoverInitValue,
    createTableMover,
    onDragEnd,
    onDragStart,
    onDragging,
} from '../../lib/tableEdit/editors/features/TableMover';

describe('Table Mover Tests', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
    let tableEdit: TableEditPlugin;
    let node: HTMLDivElement;
    const cmTable = {
        blockType: 'Table',
        rows: [
            {
                height: 20,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a1',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        format: {},
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'z1',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        format: {},
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                ],
            },
            {
                height: 20,
                format: {},
                cells: [
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'a2',
                                        format: {},
                                    },
                                ],
                                format: {},
                                isImplicit: true,
                            },
                        ],
                        format: {},
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                    {
                        blockGroupType: 'TableCell',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'z2',
                                        format: {},
                                    },
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        format: {},
                        spanLeft: false,
                        spanAbove: false,
                        isHeader: false,
                        dataset: {},
                    },
                ],
            },
        ],
        format: {
            id: `${targetId}`,
        },
        widths: [10, 10],
        dataset: {},
    };

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

    it('Customize component with callback', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        scrollContainer.innerHTML = '<div style="height: 300px"></div>';
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);
        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('disposer');
        const mover = runTest(0, true, (editorType, element) => {
            if (element && editorType == 'TableMover') {
                changeCb();
            }
            return () => disposer();
        });

        mover?.featureHandler?.dispose();

        expect(disposer).toHaveBeenCalled();
        expect(changeCb).toHaveBeenCalled();
    });

    it('Dont customize component with callback, editor type not in callback', () => {
        //Arrange
        const scrollContainer = document.createElement('div');
        scrollContainer.innerHTML = '<div style="height: 300px"></div>';
        document.body.insertBefore(scrollContainer, document.body.childNodes[0]);
        scrollContainer.append(node);
        spyOn(editor, 'getScrollContainer').and.returnValue(scrollContainer);

        const disposer = jasmine.createSpy('disposer');
        const changeCb = jasmine.createSpy('disposer');
        const mover = runTest(0, true, (editorType, element) => {
            if (element && editorType == 'TableResizer') {
                changeCb();
            }
            return () => disposer();
        });

        mover?.featureHandler?.dispose();

        expect(disposer).toHaveBeenCalled();
        expect(changeCb).not.toHaveBeenCalled();
    });

    it('On click event', () => {
        const table = document.getElementById(targetId) as HTMLTableElement;

        const tableEditor = new TableEditor(editor, table, () => true);

        tableEditor.onSelect(table);

        const selection = editor.getDOMSelection();
        expect(selection?.type).toBe('table');
        if (selection?.type == 'table') {
            expect(selection).toEqual({
                table,
                firstRow: 0,
                firstColumn: 0,
                lastRow: 1,
                lastColumn: 1,
                type: 'table',
            });
        }
    });

    it('Move - onDragStart', () => {
        //Arrange
        node.style.height = '10px';
        node.style.overflowX = 'auto';
        node.scrollTop = 0;
        const target = document.getElementById(targetId);
        editor.focus();

        const divParent = document.createElement('div');
        const divChild = document.createElement('div');
        divParent.appendChild(divChild);
        const parentSpy = spyOn(divParent, 'appendChild');

        const onStartSpy = jasmine.createSpy('onStart');
        const context = {
            table: target as HTMLTableElement,
            zoomScale: 0,
            rect: null,
            isRTL: false,
            editor: editor,
            div: divChild,
            onFinishDragging: () => {},
            onStart: onStartSpy,
            onEnd: () => {},
        };
        const initialSelection = editor.getDOMSelection();

        //Act
        const initvalue = onDragStart(context);

        //Assert
        expect(parentSpy).toHaveBeenCalled();
        expect(onStartSpy).toHaveBeenCalled();

        expect(initvalue.cmTable).toBeDefined();
        expect(initvalue.initialSelection).toEqual(initialSelection);
        expect(initvalue.tableRect).toBeDefined();
    });

    it('Move - onDragging', () => {
        //Arrange
        const nodeHeight = 100;
        node.style.height = `${nodeHeight}px`;
        node.style.overflowX = 'auto';
        node.scrollTop = 0;
        const target = document.getElementById(targetId);
        editor.focus();

        const div = document.createElement('div');

        const context = {
            table: target as HTMLTableElement,
            zoomScale: 0,
            rect: null,
            isRTL: false,
            editor: editor,
            div: div,
            onFinishDragging: () => {},
            onStart: () => {},
            onEnd: () => {},
        };
        const divRect = document.createElement('div');
        divRect.style.position = 'fixed';
        divRect.style.top = '0px';
        divRect.style.left = '0px';

        const initValue: TableMoverInitValue = {
            cmTable: undefined,
            initialSelection: null,
            tableRect: divRect,
            copyKey: 'ctrlKey',
        };

        //Act
        const draggingOutsideEditor = onDragging(
            context,
            { clientX: nodeHeight + 10, clientY: nodeHeight + 10 } as MouseEvent,
            initValue
        );
        const targetRect = target?.getBoundingClientRect();
        const draggingInsideEditor = onDragging(
            context,
            {
                clientX: targetRect?.height ?? 0 / 2,
                clientY: targetRect?.width ?? 0 / 2,
            } as MouseEvent,
            initValue
        );

        //Assert
        expect(draggingOutsideEditor).toBe(false);
        expect(draggingInsideEditor).toBe(true);
        expect(parseFloat(divRect.style.top)).toBeGreaterThan(0);
        expect(parseFloat(divRect.style.left)).toBeGreaterThan(0);
    });

    describe('Move - onDragEnd', () => {
        let target: HTMLTableElement;
        const nodeHeight = 100;

        beforeEach(() => {
            //Arrange
            node.style.height = `${nodeHeight}px`;
            node.style.overflowX = 'auto';
            node.scrollTop = 0;
            target = document.getElementById(targetId) as HTMLTableElement;
            editor.focus();
        });

        it('remove tableRect', () => {
            const div = document.createElement('div');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: () => {},
                onStart: () => {},
                onEnd: () => {},
            };
            const divRect = document.createElement('div');
            divRect.id = 'testRect';
            document.body.appendChild(divRect);

            const initValue: TableMoverInitValue = {
                cmTable: undefined,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            //Act
            onDragEnd(context, { clientX: 10, clientY: 10 } as MouseEvent, initValue);

            //Assert
            expect(document.getElementById('testRect')).toBeNull();
        });

        it('onFinishDragging', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');
            const initValue: TableMoverInitValue = {
                cmTable: undefined,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            const event = new MouseEvent('mouseup', { clientX: 10, clientY: 10, bubbles: false });
            spyOnProperty(event, 'target').and.returnValue(div);

            //Act
            onDragEnd(context, event, initValue);

            //Assert
            expect(onFinishDraggingSpy).toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });

        it('Drop table on itself', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');

            const initValue: TableMoverInitValue = {
                cmTable: undefined,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            const firstTableChild = target.rows[0].cells[0].firstChild;
            const event = new MouseEvent('mouseup', { clientX: 10, clientY: 10, bubbles: false });
            spyOnProperty(event, 'target').and.returnValue(firstTableChild);

            //Act
            const dropResult = onDragEnd(context, event, initValue);

            //Assert
            expect(dropResult).toBe(false);
            expect(onFinishDraggingSpy).not.toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });

        it('Drop table outside editor', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');

            const initValue: TableMoverInitValue = {
                cmTable: undefined,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            const outsideDiv = document.createElement('div');
            document.body.appendChild(outsideDiv);
            const event = new MouseEvent('mouseup', { clientX: 10, clientY: 10, bubbles: false });
            spyOnProperty(event, 'target').and.returnValue(outsideDiv);

            //Act
            const dropResult = onDragEnd(context, event, initValue);

            //Assert
            expect(dropResult).toBe(false);
            expect(onFinishDraggingSpy).not.toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });

        it('Drop table inside editor between two texts', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');

            const initValue: TableMoverInitValue = {
                cmTable: cmTable,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            editor.formatContentModel(model => {
                model.blocks.push(
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'TEXT-A',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'TEXT-B',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    }
                );

                return true;
            });

            const divs = Array.from(node.getElementsByTagName('div'));
            let textB: HTMLElement | null = null;
            for (const div of divs) {
                if (div.textContent == 'TEXT-B') {
                    textB = div;
                    break;
                }
            }

            if (textB == null) {
                fail('no text found');
                return false;
            }

            const textBRect = textB.getBoundingClientRect();
            const event = new MouseEvent('mouseup', {
                clientX: textBRect.left,
                clientY: textBRect.top + 2,
                bubbles: false,
            });
            spyOnProperty(event, 'target').and.returnValue(textB);

            //Act
            const dropResult = onDragEnd(context, event, initValue);

            //Assert
            const finalModel = editor.getContentModelCopy('disconnected');

            expect(finalModel.blocks[0]?.blockType).toEqual('Paragraph');
            expect(finalModel.blocks[1]?.blockType).toEqual('Table');
            expect(finalModel.blocks[1]?.format.id).toEqual(targetId);
            expect(finalModel.blocks[2]?.blockType).toEqual('Paragraph');
            expect(dropResult).toBe(true);
            expect(onFinishDraggingSpy).not.toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });

        it('Drop table inside editor last br', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');

            const initValue: TableMoverInitValue = {
                cmTable: cmTable,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            editor.formatContentModel(model => {
                model.blocks.push(
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'TEXT',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    }
                );

                return true;
            });

            const brElement = node.getElementsByTagName('br')[0];
            if (brElement == null) {
                fail('no br element');
                return false;
            }
            const brElementRect = brElement.getBoundingClientRect();

            const event = new MouseEvent('mouseup', {
                clientX: brElementRect.left + 1,
                clientY: brElementRect.top + 1,
                bubbles: false,
            });
            spyOnProperty(event, 'target').and.returnValue(brElement);

            //Act
            const dropResult = onDragEnd(context, event, initValue);

            //Assert
            const finalModel = editor.getContentModelCopy('disconnected');
            expect(finalModel.blocks[0]?.blockType).toEqual('Paragraph');
            expect(finalModel.blocks[1]?.blockType).toEqual('Table');
            expect(finalModel.blocks[1]?.format.id).toEqual(targetId);
            expect(finalModel.blocks[2]?.segments[0]?.segmentType).toEqual('Br');
            expect(dropResult).toBe(true);
            expect(onFinishDraggingSpy).not.toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });

        it('Drop table inside editor below last br', () => {
            const div = document.createElement('div');
            const onEndSpy = jasmine.createSpy('onEnd');
            const onFinishDraggingSpy = jasmine.createSpy('onFinishDragging');
            const context = {
                table: target,
                zoomScale: 0,
                rect: null,
                isRTL: false,
                editor: editor,
                div: div,
                onFinishDragging: onFinishDraggingSpy,
                onStart: () => {},
                onEnd: onEndSpy,
            };
            const divRect = document.createElement('div');

            const initValue: TableMoverInitValue = {
                cmTable: cmTable,
                initialSelection: null,
                tableRect: divRect,
                copyKey: 'ctrlKey',
            };

            editor.formatContentModel(model => {
                model.blocks.push(
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'TEXT',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    },
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                        segmentFormat: {},
                    }
                );

                return true;
            });

            const brElement = node.getElementsByTagName('br')[0];
            if (brElement == null) {
                fail('no br element');
                return false;
            }
            const brElementRect = brElement.getBoundingClientRect();

            const event = new MouseEvent('mouseup', {
                clientX: brElementRect.left + 1,
                clientY: brElementRect.bottom + 5,
                bubbles: false,
            });
            spyOnProperty(event, 'target').and.returnValue(brElement);

            //Act
            const dropResult = onDragEnd(context, event, initValue);

            //Assert
            const finalModel = editor.getContentModelCopy('disconnected');
            expect(finalModel.blocks[0]?.blockType).toEqual('Paragraph');
            expect(finalModel.blocks[1]?.blockType).toEqual('Table');
            expect(finalModel.blocks[1]?.format.id).toEqual(targetId);
            expect(finalModel.blocks[2]?.segments[0]?.segmentType).toEqual('Br');
            expect(dropResult).toBe(true);
            expect(onFinishDraggingSpy).not.toHaveBeenCalled();
            expect(onEndSpy).toHaveBeenCalled();
        });
    });

    function runTest(
        scrollTop: number,
        isNotNull: boolean | null,
        onTableEditorCreatedCallback?: OnTableEditorCreatedCallback
    ) {
        //Arrange
        node.style.height = '10px';
        node.style.overflowX = 'auto';
        node.scrollTop = scrollTop;
        const target = document.getElementById(targetId);
        editor.focus();

        //Act
        const result = createTableMover(
            target as HTMLTableElement,
            editor,
            false,
            () => {},
            () => {},
            () => false,
            node,
            undefined,
            onTableEditorCreatedCallback
        );

        //Assert
        if (!isNotNull) {
            expect(result).toBeNull();
        } else {
            expect(result).toBeDefined();
        }

        return result;
    }
});
