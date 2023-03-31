import { ContentModelBlockFormat } from '../../publicTypes/format/ContentModelBlockFormat';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { createFormatContainer } from './createFormatContainer';

/**
 * @internal
 */
export function createQuote(
    format?: ContentModelBlockFormat & ContentModelSegmentFormat
): ContentModelFormatContainer {
    return createFormatContainer('blockquote', format);
}
