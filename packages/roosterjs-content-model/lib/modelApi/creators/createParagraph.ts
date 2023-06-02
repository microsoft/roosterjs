import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelParagraph } from '../../publicTypes/block/ContentModelParagraph';
import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createParagraph(
    isImplicit?: boolean,
    blockFormat?: ContentModelBlockFormat,
    segmentFormat?: ContentModelSegmentFormat,
    decorator?: ContentModelParagraphDecorator
): ContentModelParagraph {
    const result: ContentModelParagraph = {
        blockType: 'Paragraph',
        segments: [],
        format: blockFormat ? { ...blockFormat } : {},
    };

    if (segmentFormat && Object.keys(segmentFormat).length > 0) {
        result.segmentFormat = { ...segmentFormat };
    }

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
