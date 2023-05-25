import * as normalizeTable from '../../../lib/modelApi/table/normalizeTable';
import setAlignment from '../../../lib/publicApi/block/setAlignment';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../../lib/publicTypes/group/ContentModelListItem';
import { ContentModelTable } from '../../../lib/publicTypes/block/ContentModelTable';
import { createContentModelDocument } from '../../../lib/modelApi/creators/createContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { paragraphTestCommon } from './paragraphTestCommon';

describe('setAlignment', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        paragraphTestCommon(
            'setAlignment',
            editor => setAlignment(editor, 'right'),
            model,
            result,
            calledTimes
        );
    }

    it('empty content', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                blocks: [],
            },
            0
        );
    });

    it('no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            0
        );
    });

    it('Collapsed selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'end',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'end',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With selection in RTL', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            direction: 'rtl',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            direction: 'rtl',
                            textAlign: 'start',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With multiple selections', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'end',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'end',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With unmeaningful selections', () => {
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {
                            textAlign: 'end',
                        },
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'SelectionMarker',
                                isSelected: true,
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            1
        );
    });
});

describe('setAlignment in table', () => {
    let editor: IContentModelEditor;
    let setContentModel: jasmine.Spy<IContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        spyOn(normalizeTable, 'normalizeTable');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IContentModelEditor;
    });

    function runTest(
        table: ContentModelTable,
        alignment: 'left' | 'right' | 'center',
        expectedTable: ContentModelTable | null
    ) {
        const model = createContentModelDocument();
        model.blocks.push(table);

        createContentModel.and.returnValue(model);

        setAlignment(editor, alignment);

        if (expectedTable) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(
                {
                    blockGroupType: 'Document',
                    blocks: [expectedTable],
                },
                { onNodeCreated: undefined }
            );
        }
    }

    it('Table without selection', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            'center',
            null
        );
    });

    it('Table with table  only some cell selected', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            'center',
            null
        );
    });

    it('Table with whole table selected - apply center', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            'center',
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                },
                widths: [0],
                dataset: {},
            }
        );
    });

    it('Table with whole table selected - apply right', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            'right',
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {
                    marginLeft: 'auto',
                    marginRight: '',
                },
                widths: [0],
                dataset: {},
            }
        );
    });

    it('Table with whole table selected - apply left', () => {
        runTest(
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {},
                widths: [0],
                dataset: {},
            },
            'left',
            {
                blockType: 'Table',
                rows: [
                    {
                        format: {},
                        height: 0,
                        cells: [
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                dataset: {},
                                isSelected: true,
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                            {
                                blockGroupType: 'TableCell',
                                blocks: [],
                                spanAbove: false,
                                spanLeft: false,
                                format: {},
                                isSelected: true,
                                dataset: {},
                            },
                        ],
                    },
                ],
                format: {
                    marginLeft: '',
                    marginRight: 'auto',
                },
                widths: [0],
                dataset: {},
            }
        );
    });
});

describe('setAlignment in list', () => {
    let editor: IContentModelEditor;
    let setContentModel: jasmine.Spy<IContentModelEditor['setContentModel']>;
    let createContentModel: jasmine.Spy<IContentModelEditor['createContentModel']>;

    beforeEach(() => {
        setContentModel = jasmine.createSpy('setContentModel');
        createContentModel = jasmine.createSpy('createContentModel');

        editor = ({
            focus: () => {},
            addUndoSnapshot: (callback: Function) => callback(),
            setContentModel,
            createContentModel,
        } as any) as IContentModelEditor;
    });

    function runTest(
        list: ContentModelListItem,
        alignment: 'left' | 'right' | 'center',
        expectedList: ContentModelListItem | null
    ) {
        const model = createContentModelDocument();
        model.blocks.push(list);

        createContentModel.and.returnValue(model);

        setAlignment(editor, alignment);

        if (expectedList) {
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(
                {
                    blockGroupType: 'Document',
                    blocks: [expectedList],
                },
                { onNodeCreated: undefined }
            );
        }
    }

    it('List without selection', () => {
        runTest(
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [],
                formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                format: {},
            },
            'center',
            null
        );
    });

    it('List - apply left', () => {
        runTest(
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                format: {},
            },
            'left',
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {
                    textAlign: 'start',
                },
            }
        );
    });

    it('List - apply center', () => {
        runTest(
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                format: {},
            },
            'center',
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {
                    textAlign: 'center',
                },
            }
        );
    });

    it('List - apply right', () => {
        runTest(
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                format: {
                    textAlign: 'end',
                },
            },
            'right',
            {
                blockGroupType: 'ListItem',
                blockType: 'BlockGroup',
                levels: [
                    {
                        listType: 'OL',
                    },
                ],
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {},
                                isSelected: true,
                            },
                        ],
                    },
                ],
                formatHolder: {
                    segmentType: 'SelectionMarker',
                    isSelected: true,
                    format: {},
                },
                format: {
                    textAlign: 'end',
                },
            }
        );
    });
});
