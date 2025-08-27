import { unwrapBlock } from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteParagraphStyle: DeleteSelectionStep = context => {
    if (context.deleteResult === 'nothingToDelete') {
        const { insertPoint } = context;
        const { paragraph, path } = insertPoint;
        const group = path[0];
        const parentGroup = path[1];

        // If the paragraph is empty, we will delete any style in it
        // This is to ensure the paragraph style is reset to default when there is no content in the paragraph
        if (
            paragraph.segments.every(
                s => s.segmentType === 'SelectionMarker' || s.segmentType === 'Br'
            ) &&
            paragraph.segments.filter(s => s.segmentType === 'Br').length <= 1
        ) {
            if (Object.keys(paragraph.format).length > 0) {
                paragraph.format = {};
                context.deleteResult = 'range';
            } else if (
                group.blocks.length == 1 &&
                group.blocks[0] == paragraph &&
                parentGroup &&
                (group.blockGroupType == 'FormatContainer' ||
                    group.blockGroupType == 'ListItem' ||
                    group.blockGroupType == 'General')
            ) {
                // Still has nothing to delete, try to unwrap parent container
                unwrapBlock(parentGroup, group);

                path.shift();
                context.deleteResult = 'range';
            }
        }
    }
};
