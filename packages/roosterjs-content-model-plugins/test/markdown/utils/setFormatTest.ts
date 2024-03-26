import { setFormat } from '../../../lib/markdown/utils/setFormat';
import {
    ContentModelCode,
    ContentModelDocument,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

describe('setFormat', () => {
    function runTest(
        input: ContentModelDocument,
        char: string,
        format: ContentModelSegmentFormat,
        expectedModel: ContentModelDocument,
        expectedResult: boolean,
        code: ContentModelCode | undefined = undefined
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

        setFormat(
            {
                focus: () => {},
                formatContentModel: formatWithContentModelSpy,
            } as any,
            char,
            format,
            code
        );

        expect(formatWithContentModelSpy).toHaveBeenCalled();
        expect(input).toEqual(expectedModel);
    }

    it('no selected segments', () => {
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
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '*', { fontWeight: 'bold' }, input, false);
    });

    it('should set bold', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '*test*',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                fontWeight: 'bold',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '*', { fontWeight: 'bold' }, expectedModel, true);
    });

    it('should set strikethrough', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '~test~',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                strikethrough: true,
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '~', { strikethrough: true }, expectedModel, true);
    });

    it('should set italic', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '_test_',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {
                                italic: true,
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '_', { italic: true }, expectedModel, true);
    });

    it('should set code', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '`test`',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            code: {
                                format: {},
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '`', {}, expectedModel, true, { format: {} });
    });

    it('should set code with format', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '`test`',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test',
                            format: {},
                            code: {
                                format: {
                                    fontFamily: 'arial',
                                },
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };
        runTest(input, '`', {}, expectedModel, true, { format: { fontFamily: 'arial' } });
    });

    it('should set bold in multiple words', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '*test  one  two*',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'test  one  two',
                            format: {
                                fontWeight: 'bold',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        runTest(input, '*', { fontWeight: 'bold' }, expectedModel, true);
    });

    it('should set bold in long sentence', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test  one  *two*',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        const expectedModel: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: 'test  one  ',
                            format: {},
                        },
                        {
                            segmentType: 'Text',
                            text: 'two',
                            format: {
                                fontWeight: 'bold',
                            },
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        runTest(input, '*', { fontWeight: 'bold' }, expectedModel, true);
    });

    it('should not set bold', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '*test**',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        runTest(input, '*', { fontWeight: 'bold' }, input, false);
    });

    it('should not set bold - only one *', () => {
        const input: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [
                {
                    blockType: 'Paragraph',
                    segments: [
                        {
                            segmentType: 'Text',
                            text: '*test',
                            format: {},
                        },
                        {
                            segmentType: 'SelectionMarker',
                            format: {},
                            isSelected: true,
                        },
                    ],
                    format: {},
                },
            ],
            format: {},
        };

        runTest(input, '*', { fontWeight: 'bold' }, input, false);
    });
});
