import type { HasFocus } from 'roosterjs-content-model-types';

/**
 * @internal
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export const hasFocus: HasFocus = core => {
    const activeElement = core.logicalRoot.ownerDocument.activeElement;
    return !!(activeElement && core.logicalRoot.contains(activeElement));
};
