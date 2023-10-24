import type { SwitchShadowEdit } from '../publicTypes/coreApi/SwitchShadowEdit';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (core, isOn): void => {
    if (isOn != !!core.pluginState.lifecycle.isInShadowEdit) {
        if (isOn) {
            const model = !core.pluginState.cache.cachedModel
                ? core.api.createContentModel(core)
                : null;

            core.api.triggerEvent(
                core,
                {
                    eventType: 'enteredShadowEdit',
                },
                false /*broadcast*/
            );

            // This need to be done after EnteredShadowEdit event is triggered since EnteredShadowEdit event will cause a SelectionChanged event
            // if current selection is table selection or image selection
            if (!core.pluginState.cache.cachedModel && model) {
                core.pluginState.cache.cachedModel = model;
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

            if (core.pluginState.cache.cachedModel) {
                core.api.setContentModel(core, core.pluginState.cache.cachedModel);
            }
        }
    }
};
