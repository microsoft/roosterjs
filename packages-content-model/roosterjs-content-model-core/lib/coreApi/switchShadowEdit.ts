import { iterateSelections } from '../publicApi/selection/iterateSelections';
import { moveChildNodes } from 'roosterjs-content-model-dom';
import type { SwitchShadowEdit } from 'roosterjs-content-model-types';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param editorCore The StandaloneEditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (editorCore, isOn): void => {
    // TODO: Use strong-typed editor core object
    const core = editorCore;

    if (isOn != !!core.lifecycle.shadowEditFragment) {
        if (isOn) {
            const model = !core.cache.cachedModel ? core.api.createContentModel(core) : null;

            // Fake object, not used in Content Model Editor, just to satisfy original editor code
            // TODO: we can remove them once we have standalone Content Model Editor
            const fragment = core.contentDiv.ownerDocument.createDocumentFragment();
            const clonedRoot = core.contentDiv.cloneNode(true /*deep*/);

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

            core.lifecycle.shadowEditFragment = fragment;
        } else {
            core.lifecycle.shadowEditFragment = null;

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
