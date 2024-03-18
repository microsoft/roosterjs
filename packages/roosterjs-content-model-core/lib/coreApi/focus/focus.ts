import type { Focus } from 'roosterjs-content-model-types';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export const focus: Focus = core => {
    if (!core.lifecycle.shadowEditFragment) {
        const { api, domHelper, selection } = core;

        if (!domHelper.hasFocus() && selection.selection?.type == 'range') {
            api.setDOMSelection(core, selection.selection, true /*skipSelectionChangedEvent*/);
        }

        // fallback, in case editor still have no focus
        if (!domHelper.hasFocus()) {
            core.logicalRoot.focus();
        }
    }
};
