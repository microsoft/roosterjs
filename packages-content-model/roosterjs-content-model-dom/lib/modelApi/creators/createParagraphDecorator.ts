import type {
    ContentModelParagraphDecorator,
    ContentModelSegmentFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelParagraphDecorator model
 * @param tagName Tag name of this decorator
 * @param format @optional The format of this model
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
