import { adjustImageSelectionOnSafari } from './adjustImageSelectionOnSafari';
import { adjustSelectionForCopyCut } from './adjustSelectionForCopyCut';
import { onCreateCopyEntityNode } from '../../override/pasteCopyBlockEntityParser';
import {
    contentModelToDom,
    contentModelToText,
    createModelToDomContext,
    trimModelForSelection,
    isElementOfType,
    isNodeOfType,
    wrap,
} from 'roosterjs-content-model-dom';
import type {
    DOMSelection,
    IEditor,
    OnNodeCreated,
    TextAndHtmlContentForCopy,
} from 'roosterjs-content-model-types';

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
 * Get the content for the copy event
 * @param editor The editor object
 * @param isCut if the event cut the content.
 * @param event the clipboard event that triggered the copy/cut
 * @returns
 */
export function getContentForCopy(
    editor: IEditor,
    isCut: boolean,
    event: ClipboardEvent
): TextAndHtmlContentForCopy | null {
    const selection = editor.getDOMSelection();
    adjustImageSelectionOnSafari(editor, selection);

    if (selection && (selection.type !== 'range' || !selection.range.collapsed)) {
        const pasteModel = editor.getContentModelCopy('disconnected');
        const context = createModelToDomContext();
        trimModelForSelection(pasteModel, selection);

        if (selection.type === 'range') {
            adjustSelectionForCopyCut(pasteModel);
        }

        context.onNodeCreated = onNodeCreated;
        const doc = editor.getDocument();
        const tempDiv = doc.createElement('div');

        const selectionForCopy = contentModelToDom(doc, tempDiv, pasteModel, context);
        const newRange = selectionForCopy ? domSelectionToRange(doc, selectionForCopy) : null;
        if (newRange) {
            const { clonedRoot } = editor.triggerEvent('beforeCutCopy', {
                clonedRoot: tempDiv,
                range: newRange,
                rawEvent: event,
                isCut,
            });

            return {
                htmlContent: clonedRoot,
                textContent: contentModelToText(pasteModel),
            };
        }
    }
    return null;
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
