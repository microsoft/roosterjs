import { markdownProcessor } from './processor/markdownProcessor';
import type { MarkdownToModelOptions } from './types/MarkdownToModelOptions';
import type { ContentModelDocument, ContentModelEntity } from 'roosterjs-content-model-types';

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param text The markdown text
 * @param splitLinesPattern The pattern to split lines. Default is /\r\n|\r|\\n|\n/
 * @param entities Optional array that will be populated with every entity created during the
 * conversion (e.g. math entities), so the caller knows which entities are new.
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(
    text: string,
    splitLinesPattern?: string,
    entities?: ContentModelEntity[]
): ContentModelDocument;

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param text The markdown text
 * @param options The markdown options
 * @param entities Optional array that will be populated with every entity created during the
 * conversion (e.g. math entities), so the caller knows which entities are new.
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(
    text: string,
    options?: MarkdownToModelOptions,
    entities?: ContentModelEntity[]
): ContentModelDocument;

export function convertMarkdownToContentModel(
    text: string,
    splitLinesPatternOrOptions?: string | MarkdownToModelOptions,
    entities?: ContentModelEntity[]
): ContentModelDocument {
    const options: MarkdownToModelOptions =
        (typeof splitLinesPatternOrOptions === 'string'
            ? {
                  splitLinesPattern: splitLinesPatternOrOptions,
              }
            : splitLinesPatternOrOptions) ?? {};

    return markdownProcessor(text, entities ? { ...options, entities } : options);
}
