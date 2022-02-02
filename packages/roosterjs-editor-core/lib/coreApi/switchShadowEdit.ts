import { createRange, getSelectionPath, moveChildNodes, selectTable } from 'roosterjs-editor-dom';
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
            const selection = core.api.getSelectionRangeEx(core);
            shadowEditSelectionPath =
                selection && selection.ranges.map(range => getSelectionPath(contentDiv, range));
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

            if (shadowEditSelectionPath.length == 1) {
                core.api.selectRange(
                    core,
                    createRange(
                        contentDiv,
                        shadowEditSelectionPath[0].start,
                        shadowEditSelectionPath[0].end
                    )
                );
            } else if (core.domEvent.tableSelectionRange) {
                const { table, coordinates } = core.domEvent.tableSelectionRange;
                const tableId = table.id;
                const tableElement = core.contentDiv.querySelector('#' + tableId);
                if (table) {
                    core.domEvent.tableSelectionRange = selectTable(
                        tableElement as HTMLTableElement,
                        coordinates
                    );
                }
            }
        }
    }
};
