import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get root element of the given selection
 */
export function getSelectionRootNode(selection: DOMSelection | undefined): Node | undefined {
    return !selection
        ? undefined
        : selection.type == 'range'
        ? selection.range.commonAncestorContainer
        : selection.type == 'table'
        ? selection.table
        : selection.type == 'image'
        ? selection.image
        : undefined;
}
