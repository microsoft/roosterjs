import { adjustWordSelection } from '../../../lib/modelApi/selection/adjustWordSelection';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegment } from '../../../lib/publicTypes/segment/ContentModelSegment';

const defaultMarker: ContentModelSegment = {
    segmentType: 'SelectionMarker',
    format: {},
    isSelected: true,
};

describe('adjustWordSelection', () => {
    function runTest(
        model: ContentModelDocument,
        result: ContentModelSegment[],
        markerIndex: number
    ) {
        const marker: ContentModelSegment =
            model.blocks[0].blockType == 'Paragraph'
                ? model.blocks[0].segments[markerIndex]
                : defaultMarker;
        const adjustedResult = adjustWordSelection(model, marker);
        expect(adjustedResult).toEqual(result);
        expect(adjustedResult).toContain(marker);
    }

    it('Adjust No Words', () => {
        //'|'
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [defaultMarker],
                    },
                ],
            },
            [defaultMarker],
            0
        );
    });

    it('Adjust Spaces', () => {
        //'    |    '
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
                                text: '    ',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: '    ',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [defaultMarker],
            1
        );
    });

    it('Adjust Single Word - Before', () => {
        //'|Word'
        runTest(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        format: {},
                        segments: [
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'Word',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [defaultMarker],
            0
        );
    });

    it('Adjust Single Word - Middle', () => {
        //'Wo|rd'
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
                                text: 'Wo',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'rd',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [
                {
                    segmentType: 'Text',
                    text: 'Wo',
                    format: {},
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'rd',
                    format: {},
                },
            ],
            1
        );
    });

    it('Adjust Single Word - After', () => {
        //'Word|'
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
                                text: 'Word',
                                format: {},
                            },
                            defaultMarker,
                        ],
                    },
                ],
            },
            [defaultMarker],
            1
        );
    });

    it('Adjust Multiple Words', () => {
        //'Subject Ve|rb Object'
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
                                text: 'Subject Ve',
                                format: {},
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'rb Object',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [
                {
                    segmentType: 'Text',
                    text: 'Ve',
                    format: {},
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'rb',
                    format: {},
                },
            ],
            1
        );
    });

    it('Adjust Multiple Formatted Words', () => {
        //'Subject Ve|rb Object'
        // Every letter on Verb has different formats
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
                                text: 'Subject ',
                                format: {},
                            },
                            {
                                segmentType: 'Text',
                                text: 'V',
                                format: { fontFamily: 'V_font' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'e',
                                format: { backgroundColor: 'e_color' },
                            },
                            defaultMarker,
                            {
                                segmentType: 'Text',
                                text: 'r',
                                format: { textColor: 'r_color' },
                            },
                            {
                                segmentType: 'Text',
                                text: 'b',
                                format: { fontWeight: 'b_weight' },
                            },
                            {
                                segmentType: 'Text',
                                text: ' Object',
                                format: {},
                            },
                        ],
                    },
                ],
            },
            [
                {
                    segmentType: 'Text',
                    text: 'e',
                    format: { backgroundColor: 'e_color' },
                },
                {
                    segmentType: 'Text',
                    text: 'V',
                    format: { fontFamily: 'V_font' },
                },
                defaultMarker,
                {
                    segmentType: 'Text',
                    text: 'r',
                    format: { textColor: 'r_color' },
                },
                {
                    segmentType: 'Text',
                    text: 'b',
                    format: { fontWeight: 'b_weight' },
                },
            ],
            3
        );
    });
});
