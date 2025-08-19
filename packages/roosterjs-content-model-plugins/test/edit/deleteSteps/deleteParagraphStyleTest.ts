import { createBr, createSelectionMarker, createText } from 'roosterjs-content-model-dom';
import { deleteParagraphStyle } from '../../../lib/edit/deleteSteps/deleteParagraphStyle';
import {
    ContentModelDocument,
    ContentModelFormatContainer,
    ContentModelParagraph,
    ValidDeleteSelectionContext,
} from 'roosterjs-content-model-types';

describe('deleteParagraphStyle', () => {
    it('should delete paragraph style when paragraph is empty', () => {
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph: {
                    segments: [
                        { segmentType: 'Br' } as any,
                        { segmentType: 'SelectionMarker' } as any,
                    ],
                    format: {
                        textAlign: 'center',
                    },
                    blockType: 'Paragraph',
                },
                marker: null!,
                path: [],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('range');
        expect(context.insertPoint.paragraph.format).toEqual({});
    });

    it('should not delete paragraph style when paragraph is not empty', () => {
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph: {
                    segments: [{ segmentType: 'Text', text: 'Hello World' } as any],
                    format: {
                        textAlign: 'center',
                    },
                    blockType: 'Paragraph',
                },
                marker: null!,
                path: [],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('nothingToDelete');
        expect(context.insertPoint.paragraph.format).toEqual({
            textAlign: 'center',
        });
    });

    it('should not delete paragraph style when paragraph has multiple line breaks', () => {
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph: {
                    segments: [
                        { segmentType: 'Br' } as any,
                        { segmentType: 'Br' } as any,
                        { segmentType: 'SelectionMarker' } as any,
                    ],
                    format: {
                        textAlign: 'center',
                    },
                    blockType: 'Paragraph',
                },
                marker: null!,
                path: [],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('nothingToDelete');
        expect(context.insertPoint.paragraph.format).toEqual({
            textAlign: 'center',
        });
    });

    it('should not delete paragraph style when paragraph has no format', () => {
        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph: {
                    segments: [{ segmentType: 'Text', text: 'Hello World' } as any],
                    format: {},
                    blockType: 'Paragraph',
                },
                marker: null!,
                path: [],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('nothingToDelete');
        expect(context.insertPoint.paragraph.format).toEqual({});
    });

    it('should not unwrap parent container when there is still visible content', () => {
        const marker = createSelectionMarker();
        const text = createText('test');
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, text],
            format: {},
        };
        const formatContainer: ContentModelFormatContainer = {
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'div',
            format: {},
            blocks: [paragraph],
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [formatContainer],
        };

        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph,
                marker,
                path: [formatContainer, model],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('nothingToDelete');
        expect(context.insertPoint.paragraph.format).toEqual({});
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [formatContainer],
        });
    });

    it('should unwrap parent container when there is no visible content', () => {
        const marker = createSelectionMarker();
        const br = createBr();
        const paragraph: ContentModelParagraph = {
            blockType: 'Paragraph',
            segments: [marker, br],
            format: {},
        };
        const formatContainer: ContentModelFormatContainer = {
            blockType: 'BlockGroup',
            blockGroupType: 'FormatContainer',
            tagName: 'div',
            format: {},
            blocks: [paragraph],
        };
        const model: ContentModelDocument = {
            blockGroupType: 'Document',
            blocks: [formatContainer],
        };

        const context: ValidDeleteSelectionContext = {
            deleteResult: 'nothingToDelete',
            insertPoint: {
                paragraph,
                marker,
                path: [formatContainer, model],
            },
        };

        deleteParagraphStyle(context);

        expect(context.deleteResult).toBe('range');
        expect(context.insertPoint.paragraph.format).toEqual({});
        expect(model).toEqual({
            blockGroupType: 'Document',
            blocks: [paragraph],
        });
    });
});
