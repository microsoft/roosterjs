import { ContentModelBlockFormat, ContentModelDivider } from 'roosterjs-content-model-types';

/**
 * @internal
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
