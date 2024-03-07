import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * Get root node of a given DOM selection
 * For table selection, root node is the selected table
 * For image selection, root node is the selected image
 * For range selection, root node is the common ancestor container node of the selection range
 * @param selection The selection to get root node from
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
