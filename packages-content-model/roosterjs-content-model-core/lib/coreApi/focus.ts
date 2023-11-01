import { Focus } from '../publicTypes/coreApi/Focus';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export const focus: Focus = core => {
    if (!core.lifecycle.isInShadowEdit) {
        if (core.selection.currentSelection) {
            core.api.setDOMSelection(core, core.selection.currentSelection);
        } else {
            core.contentDiv.focus();
        }
    }
};
