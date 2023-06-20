import {
    ContentModelParagraphDecorator,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

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
