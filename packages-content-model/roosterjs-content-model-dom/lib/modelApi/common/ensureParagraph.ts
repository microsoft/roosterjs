import { addBlock } from './addBlock';
import { createParagraph } from '../creators/createParagraph';
import {
    ContentModelBlockFormat,
    ContentModelBlockGroup,
    ContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * Ensure there is a Paragraph that can insert segments in a Content Model Block Group
 * @param group The parent block group of the target paragraph
 * @param blockFormat Format of the paragraph. This is only used if we need to create a new paragraph
 */
export function ensureParagraph(
    group: ContentModelBlockGroup,
    blockFormat?: ContentModelBlockFormat
): ContentModelParagraph {
    const lastBlock = group.blocks[group.blocks.length - 1];

    if (lastBlock?.blockType == 'Paragraph') {
        return lastBlock;
    } else {
        const paragraph = createParagraph(true, blockFormat);
        addBlock(group, paragraph);

        return paragraph;
    }
}
