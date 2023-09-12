import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { getSelectionPath } from 'roosterjs-editor-dom';
import { PluginEventType, SwitchShadowEdit } from 'roosterjs-editor-types';

/**
 * @internal
 * Switch the Shadow Edit mode of editor On/Off
 * @param editorCore The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export const switchShadowEdit: SwitchShadowEdit = (editorCore, isOn): void => {
    // TODO: Use strong-typed editor core object
    const core = editorCore as ContentModelEditorCore;

    if (isOn != !!core.lifecycle.shadowEditFragment) {
        if (isOn) {
            const model = !core.contentModelEdit.cachedModel
                ? core.api.createContentModel(core)
                : null;
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            // Fake object, not used in Content Model Editor, just to satisfy original editor code
            // TODO: we can remove them once we have standalone Content Model Editor
            const fragment = core.contentDiv.ownerDocument.createDocumentFragment();
            const selectionPath = range && getSelectionPath(core.contentDiv, range);

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
            if (!core.contentModelEdit.cachedModel && model) {
                core.contentModelEdit.cachedModel = model;
            }

            core.lifecycle.shadowEditSelectionPath = selectionPath;
            core.lifecycle.shadowEditFragment = fragment;
        } else {
            core.lifecycle.shadowEditFragment = null;
            core.lifecycle.shadowEditSelectionPath = null;

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (core.contentModelEdit.cachedModel) {
                core.api.setContentModel(core, core.contentModelEdit.cachedModel);
            }
        }
    }
};
