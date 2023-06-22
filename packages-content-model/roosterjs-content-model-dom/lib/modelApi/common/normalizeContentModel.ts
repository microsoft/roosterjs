import { ContentModelBlockGroup } from 'roosterjs-content-model-types';
import { isBlockEmpty } from './isEmpty';
import { normalizeParagraph } from './normalizeParagraph';
import { unwrapBlock } from './unwrapBlock';

/**
 * For a given content model, normalize it to make the model be consistent.
 * This process includes:
 * - For a list item without any list level, unwrap the list item
 * - For a paragraph, make sure it has BR at the end if it is an empty paragraph
 * - For text segments under paragraph, make sure its space values are correct (use nbsp to replace space when necessary)
 * - For an empty block, remove it
 * @param group The root level block group of content model to normalize
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
