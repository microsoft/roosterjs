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
    const selection = core.logicalRoot.ownerDocument.defaultView?.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    return selection && range && core.logicalRoot.contains(range.commonAncestorContainer)
        ? {
              type: 'range',
              range,
              isReverted:
                  selection.focusNode != range.endContainer ||
                  selection.focusOffset != range.endOffset,
          }
        : null;
}
