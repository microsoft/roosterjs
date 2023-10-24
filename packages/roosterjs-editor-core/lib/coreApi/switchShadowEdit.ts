import { PluginEventType, SelectionRangeTypes } from 'roosterjs-editor-types';
import {
    createRange,
    getSelectionPath,
    moveContentWithEntityPlaceholders,
    restoreContentWithEntityPlaceholder,
} from 'roosterjs-editor-dom';
import type { EditorCore, SelectionRangeEx, SwitchShadowEdit } from 'roosterjs-editor-types';

/**
 * @internal
 */
export const switchShadowEdit: SwitchShadowEdit = (core: EditorCore, isOn: boolean): void => {
    const { lifecycle, contentDiv } = core;
    let {
        shadowEditEntities,
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
            shadowEditImageSelectionPath = getShadowEditSelectionPath(
                SelectionRangeTypes.ImageSelection,
                selection
            );

            shadowEditEntities = {};
            shadowEditFragment = moveContentWithEntityPlaceholders(contentDiv, shadowEditEntities);

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
            lifecycle.shadowEditEntities = shadowEditEntities;
        }

        if (lifecycle.shadowEditFragment) {
            restoreContentWithEntityPlaceholder(
                lifecycle.shadowEditFragment,
                contentDiv,
                lifecycle.shadowEditEntities,
                true /*insertClonedNode*/
            );
        }
    } else {
        lifecycle.shadowEditFragment = null;
        lifecycle.shadowEditSelectionPath = null;
        lifecycle.shadowEditEntities = null;

        if (wasInShadowEdit) {
            core.api.triggerEvent(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false /*broadcast*/
            );

            if (shadowEditFragment) {
                restoreContentWithEntityPlaceholder(
                    shadowEditFragment,
                    contentDiv,
                    shadowEditEntities
                );
            }

            if (shadowEditSelectionPath) {
                core.domEvent.selectionRange = createRange(
                    contentDiv,
                    shadowEditSelectionPath.start,
                    shadowEditSelectionPath.end
                );
            }
        }
    }
};
