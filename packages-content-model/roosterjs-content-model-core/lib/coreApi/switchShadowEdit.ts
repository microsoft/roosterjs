import { iterateSelections } from '../modelApi/selection/iterateSelections';
import type { SwitchShadowEdit } from '../publicTypes/coreApi/SwitchShadowEdit';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (core, isOn): void => {
    if (isOn != !!core.lifecycle.isInShadowEdit) {
        if (isOn) {
            const model = core.cache.cachedModel ?? core.api.createContentModel(core);

            core.api.triggerEvent(
                core,
                {
                    eventType: 'enteredShadowEdit',
                    cachedModel: model,
                },
                false /*broadcast*/
            );

            // This need to be done after EnteredShadowEdit event is triggered since EnteredShadowEdit event will cause a SelectionChanged event
            // if current selection is table selection or image selection
            if (!core.cache.cachedModel) {
                core.cache.cachedModel = model;
            }

            core.lifecycle.isInShadowEdit = true;
        } else {
            core.lifecycle.isInShadowEdit = false;

            core.api.triggerEvent(
                core,
                {
                    eventType: 'leavingShadowEdit',
                },
                false /*broadcast*/
            );

            if (core.cache.cachedModel) {
                // Force clear cached element from selected block
                iterateSelections([core.cache.cachedModel], () => {});

                core.api.setContentModel(core, core.cache.cachedModel, {
                    ignoreSelection: true, // Do not set focus and selection when quit shadow edit, focus may remain in UI control (picker, ...)
                });
            }
        }
    }
};
