import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

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
