import type {
    DOMSelection,
    GetDOMSelection,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    if (core.lifecycle.shadowEditFragment) {
        return null;
    } else {
        const selection = core.selection.selection;

        return selection && (selection.type != 'range' || !core.api.hasFocus(core))
            ? selection
            : getNewSelection(core);
    }
};

function getNewSelection(core: StandaloneEditorCore): DOMSelection | null {
    const selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    return range && core.contentDiv.contains(range.commonAncestorContainer)
        ? {
              type: 'range',
              range,
              isReverted: isSelectionReverted(selection),
          }
        : null;
}

function isSelectionReverted(selection: Selection | null | undefined): boolean {
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return (
            !range.collapsed &&
            selection.focusNode != range.endContainer &&
            selection.focusOffset != range.endOffset
        );
    }

    return false;
}
