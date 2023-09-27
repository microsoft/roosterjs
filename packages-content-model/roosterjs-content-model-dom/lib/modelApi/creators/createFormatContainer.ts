import type {
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelFormatContainer model
 * @param tag Tag name of this format container, in lower case
 * @param format @optional The format of this model
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
