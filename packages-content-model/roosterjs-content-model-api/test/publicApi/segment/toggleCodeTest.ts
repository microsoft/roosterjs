import toggleCode from '../../../lib/publicApi/segment/toggleCode';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { segmentTestCommon } from './segmentTestCommon';

describe('toggleCode', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number
    ) {
        segmentTestCommon('toggleCode', toggleCode, model, result, calledTimes);
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
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            0
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
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With selection, turn off code', () => {
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
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
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
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With mixed selection', () => {
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
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
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
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With separate selection', () => {
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
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
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
                        format: {},
                        segments: [
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {},
                                isSelected: true,
                                code: {
                                    format: {
                                        fontFamily: 'monospace',
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            1
        );
    });
});
