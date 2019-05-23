import EditorCore, { HasFocus } from '../interfaces/EditorCore';
import { contains } from 'roosterjs-editor-dom';

/**
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = (core: EditorCore) => {
    let activeElement = core.document.activeElement;
    return (
        activeElement && contains(core.contentDiv, activeElement, true /*treatSameNodeAsContain*/)
    );
};
