import { createRange, getSelectionPath, moveChildNodes } from 'roosterjs-editor-dom';
import {
    EditorCore,
    PluginEventType,
    SelectionRangeEx,
    SelectionRangeTypes,
    SwitchShadowEdit,
} from 'roosterjs-editor-types';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;
    let {
        shadowEditFragment,
        shadowEditSelectionPath,
        shadowEditTableSelectionPath,
        shadowEditImageSelectionPath,
    } = lifecycle;
    const wasInShadowEdit = !!shadowEditFragment;

    const getShadowEditSelectionPath = (
        selectionType: SelectionRangeTypes,
        shadowEditSelection?: SelectionRangeEx
    ) => {
        return (
            (shadowEditSelection?.type == selectionType &&
                shadowEditSelection.ranges
                    .map(range => getSelectionPath(contentDiv, range))
                    .map(w => w!!)) ||
            null
        );
    };

    if (isOn) {
        if (!wasInShadowEdit) {
            const selection = core.api.getSelectionRangeEx(core);
            const range = core.api.getSelectionRange(core, true /*tryGetFromCache*/);

            shadowEditSelectionPath = range && getSelectionPath(contentDiv, range);
            shadowEditTableSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.TableSelection,
                selection
            );
            shadowEditFragment = core.contentDiv.ownerDocument.createDocumentFragment();
            shadowEditImageSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.ImageSelection,
                selection
            );

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
            lifecycle.shadowEditImageSelectionPath = shadowEditImageSelectionPath;
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

            if (core.domEvent.imageSelectionRange) {
                const { image } = core.domEvent.imageSelectionRange;
                const imageElement = core.contentDiv.querySelector('#' + image.id);
                if (imageElement) {
                    core.domEvent.imageSelectionRange = core.api.selectImage(core, image);
                }
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
