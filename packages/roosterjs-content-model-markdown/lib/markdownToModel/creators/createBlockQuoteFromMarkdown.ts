import { createFormatContainer } from 'roosterjs-content-model-dom';
import { createParagraphFromMarkdown } from './createParagraphFromMarkdown';
import type {
    ContentModelFormatContainer,
    ContentModelFormatContainerFormat,
} from 'roosterjs-content-model-types';

const QuoteFormat: ContentModelFormatContainerFormat = {
    borderLeft: '3px solid rgb(200, 200, 200)',
    textColor: 'rgb(102, 102, 102)',
    marginTop: '1em',
    marginBottom: '1em',
    marginLeft: '40px',
    marginRight: '40px',
    paddingLeft: '10px',
};

/**
 * @internal
 */
export function createBlockQuoteFromMarkdown(
    text: string,
    blockquote?: ContentModelFormatContainer
): ContentModelFormatContainer {
    text = text.replace('>', '');
    const paragraph = createParagraphFromMarkdown(text);
    const quote = blockquote || createFormatContainer('blockquote', QuoteFormat);
    quote.blocks.push(paragraph);
    return quote;
}
