import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteParagraphStyle: DeleteSelectionStep = context => {
    if (context.deleteResult == 'nothingToDelete') {
        const { insertPoint } = context;
        const { paragraph } = insertPoint;

        // If the paragraph is empty, we will delete any style in it
        // This is to ensure the paragraph style is reset to default when there is no content in the paragraph
        if (
            paragraph.segments.every(
                s => s.segmentType == 'SelectionMarker' || s.segmentType == 'Br'
            ) &&
            paragraph.segments.filter(s => s.segmentType == 'Br').length <= 1 &&
            Object.keys(paragraph.format).length > 0
        ) {
            paragraph.format = {};
            context.deleteResult = 'range';
        }
    }
};
