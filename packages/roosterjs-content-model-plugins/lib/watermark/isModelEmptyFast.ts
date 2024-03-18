import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * @internal
 * A fast way to check if content model is empty
 */
export function isModelEmptyFast(model: ContentModelDocument): boolean {
    const firstBlock = model.blocks[0];

    if (model.blocks.length > 1) {
        return false; // Multiple blocks, treat as not empty
    } else if (!firstBlock) {
        return true; // No block, it is empty
    } else if (firstBlock.blockType != 'Paragraph') {
        return false; // First block is not paragraph, treat as not empty
    } else if (firstBlock.segments.length == 0) {
        return true; // No segment, it is empty
    } else if (
        firstBlock.segments.some(
            x =>
                x.segmentType == 'Entity' ||
                x.segmentType == 'Image' ||
                x.segmentType == 'General' ||
                (x.segmentType == 'Text' && x.text)
        )
    ) {
        return false; // Has meaningful segments, it is not empty
    } else {
        return firstBlock.segments.filter(x => x.segmentType == 'Br').length <= 1; // If there are more than one BR, it is not empty, otherwise it is empty
    }
}
