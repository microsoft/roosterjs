import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/block/group/ContentModelBlockGroup';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentType } from '../../publicTypes/enum/SegmentType';

/**
 * @internal
 */
export function normalizeModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case ContentModelBlockType.BlockGroup:
                normalizeModel(block);
                break;
            case ContentModelBlockType.Paragraph:
                for (let j = block.segments.length - 1; j >= 0; j--) {
                    if (isEmptySegment(block.segments[j])) {
                        block.segments.splice(j, 1);
                    }
                }
                break;
            case ContentModelBlockType.Table:
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
    return (
        segment.segmentType == ContentModelSegmentType.Text &&
        (!segment.text || /^[\r\n]*$/.test(segment.text))
    );
}

function isEmptyBlock(block: ContentModelBlock) {
    return block.blockType == ContentModelBlockType.Paragraph && block.segments.length == 0;
}
