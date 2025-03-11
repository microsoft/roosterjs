import { modelProcessor } from './processor/modelProcessor';

import type { ContentModelDocument } from 'roosterjs-content-model-types';

/**
 * Export content model document to markdown
 * @param selection The editor selection
 * @returns The markdown string
 */
export function convertContentModelToMarkdown(model: ContentModelDocument): string {
    return modelProcessor(model);
}
