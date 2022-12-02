import { ContentModelParagraphDecorator } from '../../publicTypes/decorator/ContentModelParagraphDecorator';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createParagraphDecorator(
    tagName: string,
    format?: ContentModelSegmentFormat
): ContentModelParagraphDecorator {
    return {
        tagName: tagName.toLocaleLowerCase(),
        format: { ...(format || {}) },
    };
}
