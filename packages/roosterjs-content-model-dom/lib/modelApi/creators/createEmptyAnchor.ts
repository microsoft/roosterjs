import { createText } from './createText';
import type { ContentModelSegmentFormat, ContentModelText } from 'roosterjs-content-model-types';

/**
 * Create an empty text model with anchor
 * @param tagName Tag name of this divider. Currently only hr and div are supported
 * @param format @optional The format of this model
 */
export function createEmptyAnchor(
    name: string,
    format?: ContentModelSegmentFormat
): ContentModelText {
    // Use zero width space as the text content to make sure the anchor is not empty so when delete using browser, it can be preserved
    return createText('', format, {
        dataset: {},
        format: {
            name,
        },
    });
}
