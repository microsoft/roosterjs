import { internalConvertToMutableType } from './internalConvertToMutableType';
import type {
    ContentModelFormatContainer,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';

/**
 * Create a ContentModelFormatContainer model
 * @param tag Tag name of this format container, in lower case
 * @param format @optional The format of this model
 */
export function createFormatContainer(
    tag: Lowercase<string>,
    format?: ReadonlyContentModelFormatContainerFormat
): ContentModelFormatContainer {
    const result: ReadonlyContentModelFormatContainer = {
        blockType: 'BlockGroup',
        blockGroupType: 'FormatContainer',
        tagName: tag,
        blocks: [],
        format: { ...format },
    };

    return internalConvertToMutableType(result);
}
