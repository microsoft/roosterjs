import { markdownProcessor } from './processor/markdownProcessor';

/**
 * Convert the whole content to ContentModel with the given plain text
 * @param editor The editor instance
 * @param text The markdown text
 * @param splitLinesPattern The pattern to split lines. Default is /\r\n|\r|\\n|\n/
 * @returns The ContentModelDocument
 */
export function convertMarkdownToContentModel(text: string, splitLinesPattern?: string) {
    const pattern = splitLinesPattern || /\r\n|\r|\\n|\n/;
    return markdownProcessor(text, pattern);
}
