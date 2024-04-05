import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { transformHyphen } from '../../../lib/autoFormat/hyphen/transformHyphen';
import {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    FormatContentModelContext,
} from 'roosterjs-content-model-types';

describe('transformHyphen', () => {
    function runTest(
        previousSegment: ContentModelText,
        paragraph: ContentModelParagraph,
        context: FormatContentModelContext,
        expectedResult: boolean
    ) {
        const result = transformHyphen(previousSegment, paragraph, context);
        expect(result).toBe(expectedResult);
    }

    it('with hyphen', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('No hyphen', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen between spaces', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test -- test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('with hyphen at the end', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });
    it('with hyphen at the start', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: '--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and space right', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test-- test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and space left', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test --test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });

    it('with hyphen and more text', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'testing hyphen test test--test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, true);
    });

    it('text after dashes', () => {
        const segment: ContentModelText = {
            segmentType: 'Text',
            text: 'test--test testing hyphen test',
            format: {},
        };
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [segment],
            format: {},
        };
        runTest(segment, paragraph, { canUndoByBackspace: true } as any, false);
    });
});

describe('formatTextSegmentBeforeSelectionMarker - transformHyphen', () => {
    function runTest(
        input: ContentModelDocument,
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
            (_model, previousSegment, paragraph, _markerFormat, context) => {
                return transformHyphen(previousSegment, paragraph, context);
            }
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('No hyphen', () => {
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
        };
        runTest(input, input, false);
    });

    it('with hyphen', () => {
        const text = 'test--test';
        spyOn(text, 'split').and.returnValue(['test--test ']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: text,
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
        };

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test—tes',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {},
                            isSelected: undefined,
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
        };
        runTest(input, expected, true);
    });

    it('with hyphen and left space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test-- test',
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
        };

        runTest(input, input, false);
    });

    it('with hyphen and left space', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test --test',
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
        };

        runTest(input, input, false);
    });

    it('with hyphen between spaces', () => {
        const text = 'test -- test';
        spyOn(text, 'split').and.returnValue(['test', '--', 'test']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test -- test',
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
        };

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: '—',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: ' test',
                            format: {},
                            isSelected: undefined,
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
        };
        runTest(input, expected, true);
    });

    it('with hyphen and multiple words', () => {
        const text = 'testing test--test';
        spyOn(text, 'split').and.returnValue(['testing', 'test--test ']);
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: text,
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
        };

        const expected: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'testing ',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 'test—tes',
                            format: {},
                            isSelected: undefined,
                        },
                        {
                            segmentType: 'Text',
                            text: 't',
                            format: {},
                            isSelected: undefined,
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
        };
        runTest(input, expected, true);
    });
});
