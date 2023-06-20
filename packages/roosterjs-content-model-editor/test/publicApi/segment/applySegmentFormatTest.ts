import applySegmentFormat from '../../../lib/publicApi/segment/applySegmentFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { segmentTestCommon } from './segmentTestCommon';

describe('applySegmentFormat', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelDocument,
        calledTimes: number,
        newFormat: ContentModelSegmentFormat = {
            textColor: 'red',
            italic: true,
            underline: false,
            fontSize: '10px',
        }
    ) {
        segmentTestCommon(
            'applySegmentFormat',
            editor => applySegmentFormat(editor, newFormat),
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
                                format: {
                                    fontSize: '8px',
                                },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {
                                    fontSize: '8px',
                                },
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
                                format: {
                                    fontSize: '8px',
                                },
                            },
                            {
                                segmentType: 'SelectionMarker',
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
                                isSelected: true,
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
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
                                format: { fontSize: '8pt' },
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
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
                                format: {
                                    fontSize: '8px',
                                },
                                isSelected: true,
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
                                isSelected: true,
                            },
                            {
                                segmentType: 'Text',
                                text: 'test',
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
                                isSelected: true,
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: '10px',
                                    fontWeight: undefined,
                                    italic: true,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: 'red',
                                    underline: false,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1
        );
    });

    it('With existing format', () => {
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
                                format: { fontSize: '8pt', underline: true },
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
                                format: {
                                    backgroundColor: undefined,
                                    fontFamily: undefined,
                                    fontSize: undefined,
                                    fontWeight: undefined,
                                    italic: undefined,
                                    strikethrough: undefined,
                                    superOrSubScriptSequence: undefined,
                                    textColor: undefined,
                                    underline: undefined,
                                },
                                isSelected: true,
                            },
                        ],
                    },
                ],
            },
            1,
            {}
        );
    });
});
