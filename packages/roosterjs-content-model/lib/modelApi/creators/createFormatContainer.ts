import {
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createFormatContainer(
    tag: Lowercase<string>,
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
