import { createRange, getSelectionPath, moveChildNodes } from 'roosterjs-editor-dom';
import {
    EditorCore,
    PluginEventType,
    SelectionRangeTypes,
    SwitchShadowEdit,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;
    let { shadowEditFragment, shadowEditSelectionPath, shadowEditTableSelectionPath } = lifecycle;
    const wasInShadowEdit = !!shadowEditFragment;

    if (isOn) {
        if (!wasInShadowEdit) {
            const selection = core.api.getSelectionRangeEx(core);
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditTableSelectionPath =
                (selection?.type == SelectionRangeTypes.TableSelection &&
                    selection.ranges
                        .map(range => getSelectionPath(contentDiv, range))
                        .map(w => w!!)) ||
                null;
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
            lifecycle.shadowEditTableSelectionPath = shadowEditTableSelectionPath;
        }

        moveChildNodes(contentDiv);
        if (lifecycle.shadowEditFragment) {
            contentDiv.appendChild(lifecycle.shadowEditFragment.cloneNode(true /*deep*/));
        }
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
            if (shadowEditFragment) {
                contentDiv.appendChild(shadowEditFragment);
            }
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

            if (core.domEvent.tableSelectionRange) {
                const { table, coordinates } = core.domEvent.tableSelectionRange;
                const tableId = table.id;
                const tableElement = core.contentDiv.querySelector('#' + tableId);
                if (table) {
                    core.domEvent.tableSelectionRange = core.api.selectTable(
                        core,
                        tableElement as HTMLTableElement,
                        coordinates
                    );
                }
            }
        }
    }
};
