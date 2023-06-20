import { ContentModelDocument, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createContentModelDocument(
    defaultFormat?: ContentModelSegmentFormat
): ContentModelDocument {
    const result: ContentModelDocument = {
        blockGroupType: 'Document',
        blocks: [],
    };

    if (defaultFormat) {
        result.format = defaultFormat;
    }

    return result;
}
