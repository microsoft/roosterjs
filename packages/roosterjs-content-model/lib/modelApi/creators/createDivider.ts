import { ContentModelBlockFormat, ContentModelDivider } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelDivider model
 * @param tagName Tag name of this divider. Currently only hr and div are supported
 * @param format @optional The format of this model
 */
export function createDivider(
    tagName: 'hr' | 'div',
    format?: ContentModelBlockFormat
): ContentModelDivider {
    return {
        blockType: 'Divider',
        tagName,
        format: format ? { ...format } : {},
    };
}
