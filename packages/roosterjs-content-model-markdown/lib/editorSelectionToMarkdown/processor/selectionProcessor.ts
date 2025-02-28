import { createMarkdownContentFromSelection } from '../creators/createMarkdownContentFromSelection';
import { createMarkdownImageFromSelection } from '../creators/createMarkdownImageFromSelection';
import { createMarkdownTableFromSelection } from '../creators/createMarkdownTableFromSelection';
import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function selectionProcessor(selection: DOMSelection): string {
    let content = '';
    switch (selection?.type) {
        case 'range':
            if (selection.range.collapsed) {
                return '';
            }
            content = createMarkdownContentFromSelection(selection);
            break;
        case 'image':
            content = createMarkdownImageFromSelection(selection.image);
            break;
        case 'table':
            content = createMarkdownTableFromSelection(selection);
            break;
    }
    return content;
}
