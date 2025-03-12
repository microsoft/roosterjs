import type { ReadonlyContentModelBlockGroup } from 'roosterjs-content-model-types';

/**
 * A fast way to check if content model is empty
 */
export function isModelEmptyFast(model: ReadonlyContentModelBlockGroup): boolean {
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
                (x.segmentType == 'Text' && x.text) ||
                (x.segmentType == 'SelectionMarker' && !!x.hintText)
        )
    ) {
        return false; // Has meaningful segments, it is not empty
    } else if (
        (firstBlock.format.marginRight && parseFloat(firstBlock.format.marginRight) > 0) ||
        (firstBlock.format.marginLeft && parseFloat(firstBlock.format.marginLeft) > 0)
    ) {
        return false; // Has margin (indentation is changed), it is not empty
    } else {
        return firstBlock.segments.filter(x => x.segmentType == 'Br').length <= 1; // If there are more than one BR, it is not empty, otherwise it is empty
    }
}
