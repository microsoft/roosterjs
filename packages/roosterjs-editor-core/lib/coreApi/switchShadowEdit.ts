import { createRange, getSelectionPath } from 'roosterjs-editor-dom';
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
            // Merge sibling text nodes to avoid inaccuracy of text node offset
            contentDiv.normalize();

            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);
            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditFragment = core.contentDiv.ownerDocument.createDocumentFragment();
            while (contentDiv.firstChild) {
                shadowEditFragment.appendChild(contentDiv.firstChild);
            }

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

        contentDiv.innerHTML = '';
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

            contentDiv.innerHTML = '';
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
