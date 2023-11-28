import type { Focus } from 'roosterjs-content-model-types';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The StandaloneEditorCore object
 */
export const focus: Focus = core => {
    if (!core.lifecycle.shadowEditFragment) {
        if (!core.api.hasFocus(core) && core.selection.selection?.type == 'range') {
            core.api.setDOMSelection(
                core,
                core.selection.selection,
                true /*skipSelectionChangedEvent*/
            );
        }

        // fallback, in case editor still have no focus
        if (!core.api.hasFocus(core)) {
            core.contentDiv.focus();
        }
    }
};
