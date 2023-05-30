import { getEntityFromElement, getEntitySelector, queryElements } from 'roosterjs-editor-dom';
import {
    EditorCore,
    EntityOperation,
    PluginEventType,
    RestoreUndoSnapshot,
} from 'roosterjs-editor-types';

/**
 * @internal
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export const restoreUndoSnapshot: RestoreUndoSnapshot = (core: EditorCore, step: number) => {
    if (core.undo.hasNewContent && step < 0) {
        core.api.addUndoSnapshot(
            core,
            null /*callback*/,
            null /*changeSource*/,
            false /*canUndoByBackspace*/
        );
    }

    const snapshot = core.undo.snapshotsService.move(step);

    if (snapshot && snapshot.html != null) {
        try {
            core.undo.isRestoring = true;
            core.api.setContent(
                core,
                snapshot.html,
                true /*triggerContentChangedEvent*/,
                snapshot.metadata ?? undefined
            );

            const darkColorHandler = core.darkColorHandler;
            const isDarkModel = core.lifecycle.isDarkMode;

            snapshot.knownColors.forEach(color => {
                darkColorHandler.registerColor(
                    color.lightModeColor,
                    isDarkModel,
                    color.darkModeColor
                );
            });

            snapshot.entityStates?.forEach(entityState => {
                const { type, id, state } = entityState;
                const wrapper = queryElements(
                    core.contentDiv,
                    getEntitySelector(type, id)
                )[0] as HTMLElement;
                const entity = wrapper && getEntityFromElement(wrapper);

                if (entity) {
                    core.api.triggerEvent(
                        core,
                        {
                            eventType: PluginEventType.EntityOperation,
                            operation: EntityOperation.UpdateEntityState,
                            entity: entity,
                            state,
                        },
                        false
                    );
                }
            });
        } finally {
            core.undo.isRestoring = false;
        }
    }
};
