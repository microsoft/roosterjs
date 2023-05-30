import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DeleteResult, OnDeleteEntity } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { EntityOperationEvent, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';

/**
 * @internal
 */
export function getOnDeleteEntityCallback(
    editor: IContentModelEditor,
    rawEvent?: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[] = []
): OnDeleteEntity {
    return (entity, operation) => {
        if (entity.id && entity.type) {
            // Only trigger entity operation event when the same event was not triggered before.
            // TODO: This is a temporary solution as the event deletion is handled by both original EntityPlugin/EntityFeatures and ContentModel.
            // Later when Content Model can fully replace Content Edit Features, we can remove this check.
            if (!triggeredEntityEvents.some(x => x.entity.wrapper == entity.wrapper)) {
                editor.triggerPluginEvent(PluginEventType.EntityOperation, {
                    entity: {
                        id: entity.id,
                        isReadonly: entity.isReadonly,
                        type: entity.type,
                        wrapper: entity.wrapper,
                    },
                    operation,
                    rawEvent: rawEvent,
                });
            }
        }

        // If entity is still in editor and default behavior of event is prevented, that means plugin wants to keep this entity
        // Return true to tell caller we should keep it.
        return !!rawEvent?.defaultPrevented && editor.contains(entity.wrapper);
    };
}

/**
 * @internal
 * @return True means content is changed, so need to rewrite content model to editor. Otherwise false
 */
export function handleKeyboardEventResult(
    editor: IContentModelEditor,
    model: ContentModelDocument,
    rawEvent: KeyboardEvent,
    result: DeleteResult
): boolean {
    switch (result) {
        case DeleteResult.NotDeleted:
            // We have not delete anything, we will let browser handle this event, so clear cached model if any since the content will be changed by browser
            editor.cacheContentModel(null);
            return false;

        case DeleteResult.NothingToDelete:
            // We known there is nothing to delete, no need to let browser keep handling the event
            rawEvent.preventDefault();
            return false;

        case DeleteResult.Range:
        case DeleteResult.SingleChar:
            // We have deleted what we need from content model, no need to let browser keep handling the event
            rawEvent.preventDefault();
            normalizeContentModel(model);

            if (result == DeleteResult.Range) {
                // A range is about to be deleted, so add an undo snapshot immediately
                editor.addUndoSnapshot();
            }

            // Trigger an event to let plugins know the content is about to be changed by Content Model keyboard editing.
            // So plugins can do proper handling. e.g. UndoPlugin can decide whether take a snapshot before this change happens.
            editor.triggerPluginEvent(PluginEventType.BeforeKeyboardEditing, {
                rawEvent,
            });

            return true;
    }
}

/**
 * @internal
 */
export function shouldDeleteWord(rawEvent: KeyboardEvent, isMac: boolean) {
    return (
        (isMac && rawEvent.altKey && !rawEvent.metaKey) ||
        (!isMac && rawEvent.ctrlKey && !rawEvent.altKey)
    );
}

/**
 * @internal
 */
export function shouldDeleteAllSegmentsBefore(rawEvent: KeyboardEvent) {
    return rawEvent.metaKey && !rawEvent.altKey;
}
