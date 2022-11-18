import setHeaderLevel from '../../../lib/publicApi/block/setHeaderLevel';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { paragraphTestCommon } from './paragraphTestCommon';

describe('setHeaderLevel to 1', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        paragraphTestCommon(
            'setHeaderLevel',
            editor => setHeaderLevel(editor, 1),
            model,
            result,
            calledTimes
        );
    }

    it('empty content', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                document,
                blocks: [],
            },
            0
        );
    });

    it('no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
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
                document,
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
                document,
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
                document,
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: { fontSize: '2em', fontWeight: 'bold' },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: { fontSize: '2em', fontWeight: 'bold' },
                                isSelected: true,
                            },
                        ],
                        header: {
                            headerLevel: 1,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                            },
                        },
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
                document,
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
                document,
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    fontSize: '2em',
                                    fontWeight: 'bold',
                                },
                                isSelected: true,
                            },
                        ],
                        header: {
                            headerLevel: 1,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                            },
                        },
                    },
                ],
            },
            1
        );
    });

    it('With existing header', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    fontSize: '1em',
                                    fontWeight: 'normal',
                                },
                                isSelected: true,
                            },
                        ],
                        header: {
                            headerLevel: 3,
                            format: {
                                fontSize: '1em',
                                fontWeight: 'normal',
                            },
                        },
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                document,
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    fontSize: '2em',
                                    fontWeight: 'bold',
                                },
                                isSelected: true,
                            },
                        ],
                        header: {
                            headerLevel: 1,
                            format: {
                                fontSize: '2em',
                                fontWeight: 'bold',
                            },
                        },
                    },
                ],
            },
            1
        );
    });
});

describe('setHeaderLevel to 0', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        paragraphTestCommon(
            'setHeaderLevel',
            editor => setHeaderLevel(editor, 0),
            model,
            result,
            calledTimes
        );
    }

    it('empty content', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
                blocks: [],
            },
            {
                blockGroupType: 'Document',
                document,
                blocks: [],
            },
            0
        );
    });

    it('no selection', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
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
                document,
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
                document,
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
                document,
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
            1
        );
    });

    it('With existing header', () => {
        runTest(
            {
                blockGroupType: 'Document',
                document,
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    fontSize: '1em',
                                    fontWeight: 'normal',
                                },
                                isSelected: true,
                            },
                        ],
                        header: {
                            headerLevel: 3,
                            format: {
                                fontSize: '1em',
                                fontWeight: 'normal',
                            },
                        },
                    },
                ],
            },
            {
                blockGroupType: 'Document',
                document,
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
            1
        );
    });
});
