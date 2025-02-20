import { selectionProcessor } from './processor/selectionProcessor';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Export current selection in editor to markdown
 * @param selection The editor selection
 * @returns The markdown string
 */
export function exportEditorSelectionToMarkdown(selection: DOMSelection): string {
    return selectionProcessor(selection);
}
