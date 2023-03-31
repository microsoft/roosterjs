import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';

/**
 * @internal
 */
export function createFormatContainer(
    tag: 'pre' | 'blockquote',
    format?: ContentModelBlockFormat
): ContentModelFormatContainer {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'FormatContainer',
        tagName: tag,
        blocks: [],
        format: { ...(format || {}) },
    };
}
