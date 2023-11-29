import type { Focus } from 'roosterjs-content-model-types';

/**
 * @internal
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The StandaloneEditorCore object
 */
export const focus: Focus = core => {
    if (!core.lifecycle.shadowEditFragment) {
        const { api, selection } = core;

        if (!api.hasFocus(core) && selection.selection?.type == 'range') {
            api.setDOMSelection(core, selection.selection, true /*skipSelectionChangedEvent*/);
        }

        // fallback, in case editor still have no focus
        if (!core.api.hasFocus(core)) {
            core.contentDiv.focus();
        }
    }
};
