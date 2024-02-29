import createTableMover from '../../lib/tableEdit/editors/features/TableMover';
import TableEditor from '../../lib/tableEdit/editors/TableEditor';
import { Editor } from 'roosterjs-content-model-core';
import { EditorOptions, IEditor } from 'roosterjs-content-model-types';
import { TableEditPlugin } from '../../lib/tableEdit/TableEditPlugin';

describe('Table Mover Tests', () => {
    let editor: IEditor;
    let id = 'tableSelectionContainerId';
    let targetId = 'tableSelectionTestId';
    let tableEdit: TableEditPlugin;
    let node: HTMLDivElement;

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
                blocks: [
                    {
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
                    },
                ],
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

    function runTest(scrollTop: number, isNotNull: boolean | null) {
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
            () => () => {},
            node
        );

        //Assert
        if (!isNotNull) {
            expect(result).toBeNull();
        } else {
            expect(result).toBeDefined();
        }
    }
});
