import type {
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function isBlockEmpty(block: ReadonlyContentModelBlock): boolean {
    switch (block.blockType) {
        case 'Paragraph':
            return block.segments.length == 0;

        case 'Table':
            return block.rows.every(row => row.cells.length == 0);

        case 'BlockGroup':
            return isBlockGroupEmpty(block);

        case 'Entity':
            return false;

        default:
            return false;
    }
}

/**
 * @internal
 */
export function isBlockGroupEmpty(group: ReadonlyContentModelBlockGroup): boolean {
    switch (group.blockGroupType) {
        case 'FormatContainer':
            // Format Container of DIV is a container for style, so we always treat it as not empty
            return group.tagName == 'div' ? false : group.blocks.every(isBlockEmpty);

        case 'ListItem':
            return group.blocks.every(isBlockEmpty);

        case 'Document':
        case 'General':
        case 'TableCell':
            return false;

        default:
            return true;
    }
}

/**
 * @internal
 */
export function isSegmentEmpty(segment: ReadonlyContentModelSegment): boolean {
    switch (segment.segmentType) {
        case 'Text':
            return !segment.text;

        case 'Image':
            return !segment.src;

        default:
            return false;
    }
}

/**
 * Get whether the model is empty.
 * @returns true if the model is empty.
 */
export function isEmpty(
    model: ReadonlyContentModelBlock | ReadonlyContentModelBlockGroup | ReadonlyContentModelSegment
): boolean {
    if (isBlockGroup(model)) {
        return isBlockGroupEmpty(model);
    } else if (isBlock(model)) {
        return isBlockEmpty(model);
    } else if (isSegment(model)) {
        return isSegmentEmpty(model);
    }

    return false;
}

function isSegment(
    model: ReadonlyContentModelBlock | ReadonlyContentModelBlockGroup | ReadonlyContentModelSegment
): model is ReadonlyContentModelSegment {
    return typeof (<ReadonlyContentModelSegment>model).segmentType === 'string';
}

function isBlock(
    model: ReadonlyContentModelBlock | ReadonlyContentModelBlockGroup | ReadonlyContentModelSegment
): model is ReadonlyContentModelBlock {
    return typeof (<ReadonlyContentModelBlock>model).blockType === 'string';
}

function isBlockGroup(
    model: ReadonlyContentModelBlock | ReadonlyContentModelBlockGroup | ReadonlyContentModelSegment
): model is ReadonlyContentModelBlockGroup {
    return typeof (<ReadonlyContentModelBlockGroup>model).blockGroupType === 'string';
}
