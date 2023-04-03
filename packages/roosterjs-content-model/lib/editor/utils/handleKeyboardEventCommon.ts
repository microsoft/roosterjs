import { ChangeSource, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';
import { OnDeleteEntity } from '../../modelApi/editing/DeleteSelectionStep';

/**
 * @internal
 */
export function getOnDeleteEntityCallback(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent
): OnDeleteEntity {
    return (entity, operation) => {
        if (entity.id && entity.type) {
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

        return rawEvent.defaultPrevented;
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

        editor.triggerContentChangedEvent(ChangeSource.Keyboard, rawEvent.which);
    } else {
        // We didn't delete anything from content model, so browser will handle this event and we need to clear the cache
        editor.cacheContentModel(null);
    }
}
