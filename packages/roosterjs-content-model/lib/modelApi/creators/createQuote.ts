import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelFormatContainerFormat } from '../../publicTypes/format/ContentModelFormatContainerFormat';
import { createFormatContainer } from './createFormatContainer';

/**
 * @internal
 */
export function createQuote(
    format?: ContentModelFormatContainerFormat
): ContentModelFormatContainer {
    return createFormatContainer('blockquote', format);
}
