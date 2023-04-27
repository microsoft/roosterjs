import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';

/**
 * @internal
 */
export function createFormatContainer(
    tag: string,
    format?: ContentModelBlockFormat & ContentModelSegmentFormat
): ContentModelFormatContainer {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'FormatContainer',
        tagName: tag,
        blocks: [],
        format: { ...(format || {}) },
    };
}
