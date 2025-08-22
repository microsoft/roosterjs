import { markdownProcessor } from './processor/markdownProcessor';
import type { MarkdownOptions } from './types/MarkdownOptions';
import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param text The markdown text
 * @param splitLinesPattern The pattern to split lines. Default is /\r\n|\r|\\n|\n/
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(
    text: string,
    splitLinesPattern?: string
): ContentModelDocument;

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param text The markdown text
 * @param options The markdown options
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(
    text: string,
    options?: MarkdownOptions
): ContentModelDocument;

export function convertMarkdownToContentModel(
    text: string,
    splitLinesPatternOrOptions?: string | MarkdownOptions
): ContentModelDocument {
    const options: MarkdownOptions =
        (typeof splitLinesPatternOrOptions === 'string'
            ? {
                  splitLinesPattern: splitLinesPatternOrOptions,
              }
            : splitLinesPatternOrOptions) ?? {};

    return markdownProcessor(text, options);
}
