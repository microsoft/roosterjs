import { adjustSelectionForCopyCut } from './adjustSelectionForCopyCut';
import { onCreateCopyEntityNode } from '../../../override/pasteCopyBlockEntityParser';
import { preprocessTable } from './preprocessTable';
import { pruneUnselectedModel } from './pruneUnselectedModel';
import type {
    ContentModelDocument,
    DOMSelection,
    IEditor,
    OnNodeCreated,
} from 'roosterjs-content-model-types';
import {
    contentModelToDom,
    createModelToDomContext,
    isElementOfType,
    isNodeOfType,
    iterateSelections,
    wrap,
} from 'roosterjs-content-model-dom';

/**
 * @internal
 * Exported only for unit testing
 */
export const onNodeCreated: OnNodeCreated = (modelElement, node): void => {
    if (isNodeOfType(node, 'ELEMENT_NODE') && isElementOfType(node, 'table')) {
        wrap(node.ownerDocument, node, 'div');
    }
    if (isNodeOfType(node, 'ELEMENT_NODE') && !node.isContentEditable) {
        node.removeAttribute('contenteditable');
    }
    onCreateCopyEntityNode(modelElement, node);
};

/**
 * Create the range for the "beforeCutCopy" event
 * @param editor The editor object
 * @param pasteModel The model of the selection
 * @param selection The editor selection
 * @param tempDiv A temporary DIV element used for cut/copy content
 * @returns
 */
export function createCopyRange(
    editor: IEditor,
    pasteModel: ContentModelDocument,
    selection: DOMSelection,
    tempDiv: HTMLDivElement
): Range | null {
    pruneUnselectedModel(pasteModel);
    const doc = editor.getDocument();

    if (selection.type === 'table') {
        iterateSelections(pasteModel, (_, tableContext) => {
            if (tableContext?.table) {
                preprocessTable(tableContext.table);

                return true;
            }
            return false;
        });
    } else if (selection.type === 'range') {
        adjustSelectionForCopyCut(pasteModel);
    }

    const context = createModelToDomContext();

    context.onNodeCreated = onNodeCreated;

    const selectionForCopy = contentModelToDom(tempDiv.ownerDocument, tempDiv, pasteModel, context);
    return selectionForCopy ? domSelectionToRange(doc, selectionForCopy) : null;
}

function domSelectionToRange(doc: Document, selection: DOMSelection): Range | null {
    let newRange: Range | null = null;

    if (selection.type === 'table') {
        const table = selection.table;
        const elementToSelect =
            table.parentElement?.childElementCount == 1 ? table.parentElement : table;

        newRange = doc.createRange();
        newRange.selectNode(elementToSelect);
    } else if (selection.type === 'image') {
        newRange = doc.createRange();
        newRange.selectNode(selection.image);
    } else {
        newRange = selection.range;
    }

    return newRange;
}
