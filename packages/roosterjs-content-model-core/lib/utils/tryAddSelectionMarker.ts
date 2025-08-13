import { createSelectionMarker, hasSelectionInBlockGroup } from 'roosterjs-content-model-dom';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * @param model
 * @param defaultFormat
 */
export function tryAddSelectionMarker(
    model: ContentModelDocument,
    defaultFormat: ContentModelSegmentFormat
) {
    if (!hasSelectionInBlockGroup(model)) {
        // If the initial model doesn't have selection, we need to add a selection marker
        // to make sure the editor has a selection
        const firstBlock = model.blocks[0];

        if (firstBlock?.blockType == 'Paragraph') {
            firstBlock.segments.unshift(createSelectionMarker(defaultFormat));
        }
    }
}
