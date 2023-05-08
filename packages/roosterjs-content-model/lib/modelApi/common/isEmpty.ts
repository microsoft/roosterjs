import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export function isBlockEmpty(block: ContentModelBlock): boolean {
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
export function isBlockGroupEmpty(group: ContentModelBlockGroup): boolean {
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
export function isSegmentEmpty(segment: ContentModelSegment): boolean {
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
 * @internal
 */
export function isEmpty(
    model: ContentModelBlock | ContentModelBlockGroup | ContentModelSegment
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
    model: ContentModelBlock | ContentModelBlockGroup | ContentModelSegment
): model is ContentModelSegment {
    return typeof (<ContentModelSegment>model).segmentType === 'string';
}

function isBlock(
    model: ContentModelBlock | ContentModelBlockGroup | ContentModelSegment
): model is ContentModelBlock {
    return typeof (<ContentModelBlock>model).blockType === 'string';
}

function isBlockGroup(
    model: ContentModelBlock | ContentModelBlockGroup | ContentModelSegment
): model is ContentModelBlockGroup {
    return typeof (<ContentModelBlockGroup>model).blockGroupType === 'string';
}
