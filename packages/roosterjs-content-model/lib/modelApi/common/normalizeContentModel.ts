import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { isBlockEmpty } from './isEmpty';
import { normalizeParagraph } from './normalizeParagraph';
import { unwrapBlock } from './unwrapBlock';

/**
 * @internal
 */ export function normalizeContentModel(group: ContentModelBlockGroup) {
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
                normalizeParagraph(block);
                break;
            case 'Table':
                for (let r = 0; r < block.rows.length; r++) {
                    for (let c = 0; c < block.rows[r].cells.length; c++) {
                        if (block.rows[r].cells[c]) {
                            normalizeContentModel(block.rows[r].cells[c]);
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
