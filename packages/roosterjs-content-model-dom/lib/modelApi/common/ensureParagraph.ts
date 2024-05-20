import { addBlock } from './addBlock';
import { createParagraph } from '../creators/createParagraph';
import { mutateBlock } from './mutate';
import type {
    ContentModelBlockFormat,
    ContentModelBlockGroup,
    ContentModelParagraph,
    ContentModelSegmentFormat,
    ShallowMutableContentModelBlockGroup,
    ShallowMutableContentModelParagraph,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * Ensure there is a Paragraph that can insert segments in a Content Model Block Group
 * @param group The parent block group of the target paragraph
 * @param blockFormat Format of the paragraph. This is only used if we need to create a new paragraph
 */
export function ensureParagraph(
    group: ContentModelBlockGroup,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ContentModelParagraph;

/**
 * @internal
 * Ensure there is a Paragraph that can insert segments in a Content Model Block Group (Shallow mutable)
 * @param group The parent block group of the target paragraph
 * @param blockFormat Format of the paragraph. This is only used if we need to create a new paragraph
 */
export function ensureParagraph(
    group: ShallowMutableContentModelBlockGroup,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ShallowMutableContentModelParagraph;

export function ensureParagraph(
    group: ShallowMutableContentModelBlockGroup,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat
): ShallowMutableContentModelParagraph {
    const lastBlock = group.blocks[group.blocks.length - 1];

    if (lastBlock?.blockType == 'Paragraph') {
        return mutateBlock(lastBlock);
    } else {
        const paragraph = createParagraph(true, blockFormat, segmentFormat);
        addBlock(group, paragraph);

        return paragraph;
    }
}
