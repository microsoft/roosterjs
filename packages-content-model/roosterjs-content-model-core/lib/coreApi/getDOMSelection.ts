import type {
    DOMSelection,
    GetDOMSelection,
    StandaloneEditorCore,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const getDOMSelection: GetDOMSelection = core => {
    const selection = core.selection.selection;

    return core.lifecycle.shadowEditFragment
        ? null // 1. In shadow editor, always return null
        : selection && selection.type != 'range'
        ? selection // 2. Editor has Table Selection or Image Selection, use it
        : core.api.hasFocus(core)
        ? getNewSelection(core) // 3. Not Table/Image selection, and editor has focus, pull a latest selection from DOM
        : selection; // 4. Fallback to cached selection for all other cases
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
