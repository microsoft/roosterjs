import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { isBlockEmpty, isSegmentEmpty } from './isEmpty';
import { normalizeParagraph } from './normalizeParagraph';
import { unwrapBlock } from './unwrapBlock';

/**
 * @internal
 */
export function normalizeContentModel(group: ContentModelBlockGroup) {
    for (let i = group.blocks.length - 1; i >= 0; i--) {
        const block = group.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                if (block.blockGroupType == 'ListItem' && block.levels.length == 0) {
                    i += block.blocks.length;
                    unwrapBlock(group, block);
                } else {
                    normalizeContentModel(block);
                }
                break;
            case 'Paragraph':
                removeEmptySegments(block);

                normalizeParagraph(block);
                break;
            case 'Table':
                for (let r = 0; r < block.cells.length; r++) {
                    for (let c = 0; c < block.cells[r].length; c++) {
                        if (block.cells[r][c]) {
                            normalizeContentModel(block.cells[r][c]);
                        }
                    }
                }
                break;
        }

        if (isBlockEmpty(block)) {
            group.blocks.splice(i, 1);
        }
    }
}

function removeEmptySegments(block: ContentModelParagraph) {
    for (let j = block.segments.length - 1; j >= 0; j--) {
        if (isSegmentEmpty(block.segments[j])) {
            block.segments.splice(j, 1);
        }
    }
}
