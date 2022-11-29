import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';

/**
 * @internal
 */
export function createParagraph(
    isImplicit?: boolean,
    format?: ContentModelBlockFormat,
    decorator?: ContentModelParagraphDecorator
): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: 'Paragraph',
        segments: [],
        format: format ? { ...format } : {},
    };

    if (isImplicit) {
        result.isImplicit = true;
    }

    if (decorator) {
        result.decorator = {
            tagName: decorator.tagName,
            format: { ...decorator.format },
        };
    }

    return result;
}
