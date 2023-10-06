import type { DOMSelection } from 'roosterjs-content-model-types';

/**
 * @internal
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
