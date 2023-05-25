import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { EntityOperationEvent, PluginEventType } from 'roosterjs-editor-types';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';
import { OnDeleteEntity } from '../../modelApi/edit/utils/DeleteSelectionStep';

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

        return !!rawEvent?.defaultPrevented;
    };
}

/**
 * @internal
 */
export function handleKeyboardEventResult(
    editor: IContentModelEditor,
    model: ContentModelDocument,
    rawEvent: KeyboardEvent,
    isChanged: boolean
) {
    if (isChanged) {
        // We have deleted what we need from content model, no need to let browser keep handling the event
        rawEvent.preventDefault();
        normalizeContentModel(model);

        // Trigger an event to let plugins know the content is about to be changed by Content Model keyboard editing.
        // So plugins can do proper handling. e.g. UndoPlugin can decide whether take a snapshot before this change happens.
        editor.triggerPluginEvent(PluginEventType.BeforeKeyboardEditing, {
            rawEvent,
        });
    } else {
        // We didn't delete anything from content model, so browser will handle this event and we need to clear the cache
        editor.cacheContentModel(null);
    }
}
