import { ContentModelBlockGroup, ContentModelSelectionMarker } from 'roosterjs-content-model-types';
import { deleteEmptyList } from '../../../lib/corePlugin/copyPaste/deleteEmptyList';
import { deleteSelection } from '../../../lib/publicApi/selection/deleteSelection';
import {
    createContentModelDocument,
    createListItem,
    createListLevel,
    createParagraph,
    createTable,
    createTableCell,
    createText,
    normalizeContentModel,
} from 'roosterjs-content-model-dom';

describe('deleteEmptyList -  when cut', () => {
    it('Delete all list', () => {
        const model = createContentModelDocument();
        const level = createListLevel('OL');
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const listItem1 = createListItem([level]);
        const listItem2 = createListItem([level]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        text1.isSelected = true;
        const text2 = createText('test1');
        text2.isSelected = true;

        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        para1.segments.push(marker, text1);
        para2.segments.push(text2, marker);
        model.blocks.push(listItem1, listItem2);

        const result = deleteSelection(model, [deleteEmptyList], undefined);
        normalizeContentModel(model);

        const path: ContentModelBlockGroup[] = [
            {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
            },
        ];

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para1,
            path: path,
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        {
                            segmentType: 'Br',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        });
    });

    it('Delete first list item', () => {
        const model = createContentModelDocument();
        const level = createListLevel('OL');
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const listItem1 = createListItem([level]);
        const listItem2 = createListItem([level]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const text1 = createText('test1');
        text1.isSelected = true;
        const text2 = createText('test2');

        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        para1.segments.push(text1);
        para2.segments.push(text2);
        model.blocks.push(listItem1, listItem2);

        const result = deleteSelection(model, [deleteEmptyList], undefined);
        normalizeContentModel(model);

        const path: ContentModelBlockGroup[] = [
            {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test2',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
        ];

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para1,
            path: path,
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test2',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('Delete text on list item', () => {
        const model = createContentModelDocument();
        const level = createListLevel('OL');
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const listItem1 = createListItem([level]);
        const para1 = createParagraph();
        const text1 = createText('test1');
        text1.isSelected = true;

        listItem1.blocks.push(para1);
        para1.segments.push(text1);
        model.blocks.push(listItem1);

        const result = deleteSelection(model, [deleteEmptyList], undefined);
        normalizeContentModel(model);

        const path: ContentModelBlockGroup[] = [
            {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
        ];

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: para1,
            path: path,
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('Delete in the  middle on the list', () => {
        const model = createContentModelDocument();
        const level = createListLevel('OL');
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const listItem1 = createListItem([level]);
        const listItem2 = createListItem([level]);
        const listItem3 = createListItem([level]);
        const listItem4 = createListItem([level]);
        const para1 = createParagraph();
        const para2 = createParagraph();
        const para3 = createParagraph();
        const para4 = createParagraph();
        const text1 = createText('test1');
        const text2 = createText('test2');
        const text3 = createText('test3');
        const text4 = createText('test4');

        text2.isSelected = true;
        text3.isSelected = true;

        listItem1.blocks.push(para1);
        listItem2.blocks.push(para2);
        listItem3.blocks.push(para3);
        listItem4.blocks.push(para4);

        para1.segments.push(text1);
        para2.segments.push(marker, text2);
        para3.segments.push(text3, marker);
        para4.segments.push(text4);
        model.blocks.push(listItem1, listItem2, listItem3, listItem4);

        const result = deleteSelection(model, [deleteEmptyList], undefined);
        normalizeContentModel(model);

        const path: ContentModelBlockGroup[] = [
            {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
                                format: {},
                            },
                        ],
                        format: {},
                    },
                ],
                levels: [
                    {
                        listType: 'OL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test1',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'SelectionMarker',
                                        isSelected: true,
                                        format: {},
                                    },
                                    {
                                        segmentType: 'Br',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Paragraph',
                                segments: [
                                    {
                                        segmentType: 'Text',
                                        text: 'test4',
                                        format: {},
                                    },
                                ],
                                format: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'OL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
        ];

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: path,
            tableContext: undefined,
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test1',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'SelectionMarker',
                                    isSelected: true,
                                    format: {},
                                },
                                {
                                    segmentType: 'Br',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Paragraph',
                            segments: [
                                {
                                    segmentType: 'Text',
                                    text: 'test4',
                                    format: {},
                                },
                            ],
                            format: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'OL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });

    it('Delete list with table', () => {
        const model = createContentModelDocument();
        const level = createListLevel('UL');
        const marker: ContentModelSelectionMarker = {
            segmentType: 'SelectionMarker',
            format: {},
            isSelected: true,
        };
        const listItem1 = createListItem([level]);
        const table = createTable(1);
        const cell = createTableCell();
        const para = createParagraph();
        const text = createText('test1');
        para.segments.push(text);
        cell.blocks.push(para);
        text.isSelected = true;
        para.segments.push(marker);
        table.rows[0].cells.push(cell);
        listItem1.blocks.push(table);
        model.blocks.push(listItem1);

        const result = deleteSelection(model, [deleteEmptyList], undefined);
        normalizeContentModel(model);

        const path: ContentModelBlockGroup[] = [
            {
                blockGroupType: 'TableCell',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Br',
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
            {
                blockType: 'BlockGroup',
                blockGroupType: 'ListItem',
                blocks: [
                    {
                        blockType: 'Table',
                        rows: [
                            {
                                height: 0,
                                format: {},
                                cells: [
                                    {
                                        blockGroupType: 'TableCell',
                                        blocks: [
                                            {
                                                blockType: 'Paragraph',
                                                segments: [
                                                    {
                                                        segmentType: 'SelectionMarker',
                                                        isSelected: true,
                                                        format: {},
                                                    },
                                                    {
                                                        segmentType: 'Br',
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
                        format: {},
                        widths: [],
                        dataset: {},
                    },
                ],
                levels: [
                    {
                        listType: 'UL',
                        format: {},
                        dataset: {},
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {},
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'BlockGroup',
                        blockGroupType: 'ListItem',
                        blocks: [
                            {
                                blockType: 'Table',
                                rows: [
                                    {
                                        height: 0,
                                        format: {},
                                        cells: [
                                            {
                                                blockGroupType: 'TableCell',
                                                blocks: [
                                                    {
                                                        blockType: 'Paragraph',
                                                        segments: [
                                                            {
                                                                segmentType: 'SelectionMarker',
                                                                isSelected: true,
                                                                format: {},
                                                            },
                                                            {
                                                                segmentType: 'Br',
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
                                format: {},
                                widths: [],
                                dataset: {},
                            },
                        ],
                        levels: [
                            {
                                listType: 'UL',
                                format: {},
                                dataset: {},
                            },
                        ],
                        formatHolder: {
                            segmentType: 'SelectionMarker',
                            isSelected: true,
                            format: {},
                        },
                        format: {},
                    },
                ],
            },
        ];

        expect(result.deleteResult).toBe('range');
        expect(result.insertPoint).toEqual({
            marker: marker,
            paragraph: {
                blockType: 'Paragraph',
                segments: [
                    {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    {
                        segmentType: 'Br',
                        format: {},
                    },
                ],
                format: {},
            },
            path: path,
            tableContext: {
                table: {
                    blockType: 'Table',
                    rows: [
                        {
                            height: 0,
                            format: {},
                            cells: [
                                {
                                    blockGroupType: 'TableCell',
                                    blocks: [
                                        {
                                            blockType: 'Paragraph',
                                            segments: [
                                                {
                                                    segmentType: 'SelectionMarker',
                                                    isSelected: true,
                                                    format: {},
                                                },
                                                {
                                                    segmentType: 'Br',
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
                    format: {},
                    widths: [],
                    dataset: {},
                },
                rowIndex: 0,
                colIndex: 0,
                isWholeTableSelected: false,
            },
        });
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'BlockGroup',
                    blockGroupType: 'ListItem',
                    blocks: [
                        {
                            blockType: 'Table',
                            rows: [
                                {
                                    height: 0,
                                    format: {},
                                    cells: [
                                        {
                                            blockGroupType: 'TableCell',
                                            blocks: [
                                                {
                                                    blockType: 'Paragraph',
                                                    segments: [
                                                        {
                                                            segmentType: 'SelectionMarker',
                                                            isSelected: true,
                                                            format: {},
                                                        },
                                                        {
                                                            segmentType: 'Br',
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
                            format: {},
                            widths: [],
                            dataset: {},
                        },
                    ],
                    levels: [
                        {
                            listType: 'UL',
                            format: {},
                            dataset: {},
                        },
                    ],
                    formatHolder: {
                        segmentType: 'SelectionMarker',
                        isSelected: true,
                        format: {},
                    },
                    format: {},
                },
            ],
        });
    });
});
