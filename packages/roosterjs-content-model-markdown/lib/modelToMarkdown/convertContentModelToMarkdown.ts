import { MarkdownLineBreaks } from './creators/createMarkdownBlock';
import { modelProcessor } from './processor/modelProcessor';

import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Export content model document to markdown
 * @param selection The editor selection
 * @param newLine The new line string to use. Default is '\n\n'
 * @returns The markdown string
 */
export function convertContentModelToMarkdown(
    model: ContentModelDocument,
    newLine?: MarkdownLineBreaks
): string {
    return modelProcessor(model, newLine);
}
