import { PluginEventType } from 'roosterjs-editor-types';
import { SwitchShadowEdit } from '../../publicTypes/ContentModelEditorCore';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param editorCore The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (editorCore, isOn): void => {
    const core = editorCore;

    if (isOn != core.lifecycle.isInShadowEdit) {
        if (isOn) {
            const model = !core.cache.cachedModel ? core.api.createContentModel(core) : null;
            // const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            // Fake object, not used in Content Model Editor, just to satisfy original editor code
            // TODO: we can remove them once we have standalone Content Model Editor
            // const fragment = core.contentDiv.ownerDocument.createDocumentFragment();
            // const selectionPath = range && getSelectionPath(core.contentDiv, range);

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment,
                    selectionPath,
                },
                false /*broadcast*/
            );

            // This need to be done after EnteredShadowEdit event is triggered since EnteredShadowEdit event will cause a SelectionChanged event
            // if current selection is table selection or image selection
            if (!core.cache.cachedModel && model) {
                core.cache.cachedModel = model;
            }

            core.lifecycle.isInShadowEdit = true;
            // core.lifecycle.shadowEditSelectionPath = selectionPath;
            // core.lifecycle.shadowEditFragment = fragment;
        } else {
            // core.lifecycle.shadowEditFragment = null;
            // core.lifecycle.shadowEditSelectionPath = null;
            core.lifecycle.isInShadowEdit = false;

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (core.cache.cachedModel) {
                core.api.setContentModel(core, core.cache.cachedModel);
            }
        }
    }
};
