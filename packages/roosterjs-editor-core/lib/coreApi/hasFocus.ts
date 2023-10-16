import { contains } from 'roosterjs-editor-dom';
import type { EditorCore, HasFocus } from 'roosterjs-editor-types';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = (core: EditorCore) => {
    const activeElement = core.contentDiv.ownerDocument.activeElement;
    return !!(
        activeElement && contains(core.contentDiv, activeElement, true /*treatSameNodeAsContain*/)
    );
};
