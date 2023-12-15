import type {
    DOMSelection,
    GetDOMSelection,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    return core.lifecycle.shadowEditFragment
        ? null
        : core.selection.selection ?? getNewSelection(core);
};

function getNewSelection(core: StandaloneEditorCore): DOMSelection | null {
    const selection = core.contentDiv.ownerDocument.defaultView?.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    return range && core.contentDiv.contains(range.commonAncestorContainer)
        ? {
              type: 'range',
              range: range,
          }
        : null;
}
