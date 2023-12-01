import { contains } from 'roosterjs-editor-dom';
import type { HasFocus } from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The StandaloneEditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = core => {
    const activeElement = core.contentDiv.ownerDocument.activeElement;
    return !!(
        activeElement && contains(core.contentDiv, activeElement, true /*treatSameNodeAsContain*/)
    );
};
