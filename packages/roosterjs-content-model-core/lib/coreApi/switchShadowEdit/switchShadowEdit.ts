import { iterateSelections, moveChildNodes } from 'roosterjs-content-model-dom';
import { toggleCaret } from '../setDOMSelection/toggleCaret';
import { toggleTableSelection } from '../setDOMSelection/toggleTableSelection';
import type { SwitchShadowEdit } from 'roosterjs-content-model-types';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param editorCore The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (editorCore, isOn): void => {
    const core = editorCore;

    if (isOn != !!core.lifecycle.shadowEditFragment) {
        if (isOn) {
            const model = !core.cache.cachedModel ? core.api.createContentModel(core) : null;
            const fragment = core.logicalRoot.ownerDocument.createDocumentFragment();
            const clonedRoot = core.logicalRoot.cloneNode(true /*deep*/);

            moveChildNodes(fragment, clonedRoot);

            core.api.triggerEvent(
                core,
                {
                    eventType: 'enteredShadowEdit',
                },
                false /*broadcast*/
            );

            // This need to be done after EnteredShadowEdit event is triggered since EnteredShadowEdit event will cause a SelectionChanged event
            // if current selection is table selection or image selection
            if (!core.cache.cachedModel && model) {
                core.cache.cachedModel = model;
            }

            toggleCaret(core, true /* hide */);
            toggleTableSelection(core, true /* hide */);

            core.lifecycle.shadowEditFragment = fragment;
        } else {
            core.lifecycle.shadowEditFragment = null;

            toggleCaret(core, false /* hide */);
            toggleTableSelection(core, false /* hide */);

            core.api.triggerEvent(
                core,
                {
                    eventType: 'leavingShadowEdit',
                },
                false /*broadcast*/
            );

            if (core.cache.cachedModel) {
                // Force clear cached element from selected block
                iterateSelections(core.cache.cachedModel, () => {});

                core.api.setContentModel(core, core.cache.cachedModel, {
                    ignoreSelection: true, // Do not set focus and selection when quit shadow edit, focus may remain in UI control (picker, ...)
                });
            }
        }
    }
};
