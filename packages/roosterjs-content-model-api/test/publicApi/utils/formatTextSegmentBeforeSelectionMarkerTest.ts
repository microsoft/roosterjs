import { formatTextSegmentBeforeSelectionMarker } from '../../../lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('formatTextSegmentBeforeSelectionMarker', () => {
    function runTest(
        input: ContentModelDocument,
        callback: (
            model: ContentModelDocument,
            previousSegment: ContentModelText,
            paragraph: ContentModelParagraph,
            markerFormat: ContentModelSegmentFormat,
            context: FormatContentModelContext
        ) => boolean,
        expectedModel: ContentModelDocument,
        expectedResult: boolean
    ) {
        const formatWithContentModelSpy = jasmine
            .createSpy('formatWithContentModel')
            .and.callFake((callback, options) => {
                const result = callback(input, {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    canUndoByBackspace: true,
                });
                expect(result).toBe(expectedResult);
            });

        formatTextSegmentBeforeSelectionMarker(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            callback
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('no selection marker', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                        },
                    ],
                    format: {},
                },
            ],
        };
        runTest(input, () => true, input, false);
    });

    it('no previous segment', () => {
        const input: ContentModelDocument = {
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
                    ],
                    format: {},
                },
            ],
        };
        runTest(input, () => true, input, false);
    });

    it('previous segment is not text', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Image',
                            src: 'test',
                            format: {},
                            dataset: {},
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
        };
        runTest(input, () => true, input, false);
    });

    it('format segment', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'first',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'second',
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
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'first',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'second',
                            format: {
                                textColor: 'red',
                            },
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
        };
        runTest(
            input,
            (_model, previousSegment) => {
                previousSegment.format = { textColor: 'red' };
                return true;
            },
            expectedModel,
            true
        );
    });
});
