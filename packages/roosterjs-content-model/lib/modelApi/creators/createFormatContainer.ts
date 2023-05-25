import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';

/**
 * @internal
 */
export function createFormatContainer(
    tag: string,
    format?: ContentModelFormatContainerFormat
): ContentModelFormatContainer {
    return {
        blockType: 'BlockGroup',
        blockGroupType: 'FormatContainer',
        tagName: tag,
        blocks: [],
        format: { ...(format || {}) },
    };
}
