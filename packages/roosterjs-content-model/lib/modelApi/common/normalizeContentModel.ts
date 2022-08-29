import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';

/**
 * @internal
 */
export function normalizeModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                normalizeModel(block);
                break;
            case 'Paragraph':
                for (let j = block.segments.length - 1; j >= 0; j--) {
                    if (isEmptySegment(block.segments[j])) {
                        block.segments.splice(j, 1);
                    }
                }
                break;
            case 'Table':
                for (let r = 0; r < block.cells.length; r++) {
                    for (let c = 0; c < block.cells[r].length; c++) {
                        normalizeModel(block.cells[r][c]);
                    }
                }
                break;
        }

        if (isEmptyBlock(block)) {
            group.blocks.splice(i, 1);
        }
    }
}

function isEmptySegment(segment: ContentModelSegment) {
    return segment.segmentType == 'Text' && (!segment.text || /^[\r\n]*$/.test(segment.text));
}

function isEmptyBlock(block: ContentModelBlock) {
    switch (block.blockType) {
        case 'Paragraph':
            return block.segments.length == 0;

        case 'Table':
            return block.cells.length == 0 || block.cells.every(row => row.length == 0);

        default:
            return false;
    }
}
