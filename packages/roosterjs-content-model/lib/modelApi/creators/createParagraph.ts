import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

/**
 * @internal
 */
export function createParagraph(isImplicit?: boolean): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: 'Paragraph',
        segments: [],
    };

    if (isImplicit) {
        result.isImplicit = true;
    }

    return result;
}
