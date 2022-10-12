import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';

/**
 * @internal
 */
export function createParagraph(
    isImplicit?: boolean,
    format?: ContentModelBlockFormat
): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: 'Paragraph',
        segments: [],
        format: format ? { ...format } : {},
    };

    if (isImplicit) {
        result.isImplicit = true;
    }

    return result;
}
