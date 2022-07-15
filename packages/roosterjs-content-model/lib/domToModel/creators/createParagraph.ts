import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

/**
 * @internal
 */
export function createParagraph(isDummy: boolean): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: ContentModelBlockType.Paragraph,
        segments: [],
    };

    if (isDummy) {
        result.isDummy = true;
    }

    return result;
}
