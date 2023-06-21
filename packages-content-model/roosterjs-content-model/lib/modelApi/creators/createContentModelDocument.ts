import { ContentModelDocument, ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelDocument model
 * @param defaultFormat @optional Default format of this model
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
