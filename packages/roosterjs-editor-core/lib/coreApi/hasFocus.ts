import { contains } from 'roosterjs-editor-dom';
import { EditorCore, HasFocus } from 'roosterjs-editor-types';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = (core: EditorCore) => {
    let node = core.contentDiv.parentNode;

    while (node.nodeType != 9 && node.nodeType != 11) {
        node = node.parentNode;
    }

    let activeElement = (<Document>node).activeElement;
    return (
        activeElement && contains(core.contentDiv, activeElement, true /*treatSameNodeAsContain*/)
    );
};
