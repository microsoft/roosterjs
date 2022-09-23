import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export function isBlockEmpty(block: ContentModelBlock): boolean {
    switch (block.blockType) {
        case 'Paragraph':
            return block.segments.length == 0;

        case 'Table':
            return block.cells.every(row => row.length == 0);

        case 'BlockGroup':
            return isBlockGroupEmpty(block);

        default:
            return false;
    }
}

/**
 * @internal
 */
export function isBlockGroupEmpty(group: ContentModelBlockGroup): boolean {
    return group.blocks.every(isBlockEmpty);
}

/**
 * @internal
 */
export function isSegmentEmpty(segment: ContentModelSegment): boolean {
    switch (segment.segmentType) {
        case 'Text':
            return !segment.text || /^[\r\n]*$/.test(segment.text);

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
