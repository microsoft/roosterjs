import { HasFocus } from '../publicTypes/coreApi/HasFocus';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = core => {
    const activeElement = core.contentDiv.ownerDocument.activeElement;
    return !!(activeElement && core.contentDiv.contains(activeElement));
};
