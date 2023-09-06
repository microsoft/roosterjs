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
            if (!core.cachedModel) {
                core.cachedModel = core.api.createContentModel(core);
            }

            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            core.lifecycle.shadowEditSelectionPath =
                range && getSelectionPath(core.contentDiv, range);
            core.lifecycle.shadowEditFragment = core.contentDiv.ownerDocument.createDocumentFragment();

            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: core.lifecycle.shadowEditFragment,
                    selectionPath: core.lifecycle.shadowEditSelectionPath,
                },
                false /*broadcast*/
            );
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

            if (core.cachedModel) {
                core.api.setContentModel(core, core.cachedModel);
            }
        }
    }
};
