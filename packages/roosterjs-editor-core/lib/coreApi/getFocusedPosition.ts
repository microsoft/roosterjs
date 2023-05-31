import { contains, Position } from 'roosterjs-editor-dom';
import { EditorCore, GetFocusedPosition } from 'roosterjs-editor-types';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export const getFocusedPosition: GetFocusedPosition = (core: EditorCore) => {
    const contentDiv = core.contentDiv;
    let sel = contentDiv.ownerDocument.defaultView?.getSelection();

    if (sel?.focusNode && contains(contentDiv, sel.focusNode)) {
        return new Position(sel.focusNode, sel.focusOffset);
    }

    let range = core.api.getSelectionRange(core, true /* tryGetFromCache */);
    if (range) {
        return Position.getStart(range);
    }

    return null;
};
