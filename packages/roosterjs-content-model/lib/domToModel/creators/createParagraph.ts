import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

/**
 * @internal
 */
export function createParagraph(isImplicit?: boolean): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: ContentModelBlockType.Paragraph,
        segments: [],
    };

    if (isImplicit) {
        result.isImplicit = true;
    }

    return result;
}
