import { ContentModelEditorCore } from '../../publicTypes/ContentModelEditorCore';
import { SwitchShadowEdit } from 'roosterjs-editor-types';

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
        if (isOn && !core.cachedModel) {
            core.cachedModel = core.api.createContentModel(core);
        }

        core.originalApi.switchShadowEdit(editorCore, isOn);

        if (!isOn && core.cachedModel) {
            core.api.setContentModel(core, core.cachedModel);
        }
    }
};
