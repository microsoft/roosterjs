import { createRange, getSelectionPath, moveChildNodes } from 'roosterjs-editor-dom';
import { EditorCore, PluginEventType, SwitchShadowEdit } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;
    let { shadowEditFragment, shadowEditSelectionPath } = lifecycle;
    const wasInShadowEdit = !!shadowEditFragment;

    if (isOn) {
        if (!wasInShadowEdit) {
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditFragment = core.contentDiv.ownerDocument.createDocumentFragment();

            moveChildNodes(shadowEditFragment, contentDiv);
            shadowEditFragment.normalize();
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: shadowEditFragment,
                    selectionPath: shadowEditSelectionPath,
                },
                false /*broadcast*/
            );

            lifecycle.shadowEditFragment = shadowEditFragment;
            lifecycle.shadowEditSelectionPath = shadowEditSelectionPath;
        }

        moveChildNodes(contentDiv);
        contentDiv.appendChild(lifecycle.shadowEditFragment.cloneNode(true /*deep*/));
    } else {
        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditSelectionPath = null;

        if (wasInShadowEdit) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            moveChildNodes(contentDiv);
            contentDiv.appendChild(shadowEditFragment);
            core.api.focus(core);

            if (shadowEditSelectionPath) {
                core.api.selectRange(
                    core,
                    createRange(
                        contentDiv,
                        shadowEditSelectionPath.start,
                        shadowEditSelectionPath.end
                    )
                );
            }
        }
    }
};
