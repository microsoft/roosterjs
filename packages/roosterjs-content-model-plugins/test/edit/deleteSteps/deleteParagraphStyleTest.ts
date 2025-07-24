import { deleteParagraphStyle } from '../../../lib/edit/deleteSteps/deleteParagraphStyle';
import { ValidDeleteSelectionContext } from 'roosterjs-content-model-types';

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
});
