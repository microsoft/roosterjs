import type { DOMSelection, GetDOMSelection, EditorCore } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    if (core.lifecycle.shadowEditFragment) {
        return null;
    } else {
        const selection = core.selection.selection;

        return selection && (selection.type != 'range' || !core.domHelper.hasFocus())
            ? selection
            : getNewSelection(core);
    }
};

function getNewSelection(core: EditorCore): DOMSelection | null {
    const range = core.domHelper.getSelectionRange();

    if (!range || !core.logicalRoot.contains(range.commonAncestorContainer)) {
        return null;
    }

    const selection = core.logicalRoot.ownerDocument.defaultView?.getSelection();
    const isReverted = selection
        ? selection.focusNode != range.endContainer || selection.focusOffset != range.endOffset
        : false;

    return {
        type: 'range',
        range,
        isReverted,
    };
}
