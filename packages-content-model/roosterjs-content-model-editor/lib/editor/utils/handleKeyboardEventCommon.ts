import { DeleteResult } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { normalizeContentModel } from 'roosterjs-content-model-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelDocument } from 'roosterjs-content-model-types';
import type { FormatWithContentModelContext } from '../../publicTypes/parameter/FormatWithContentModelContext';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 * @return True means content is changed, so need to rewrite content model to editor. Otherwise false
 */
export function handleKeyboardEventResult(
    editor: IContentModelEditor,
    model: ContentModelDocument,
    rawEvent: KeyboardEvent,
    result: DeleteResult,
    context: FormatWithContentModelContext
): boolean {
    context.skipUndoSnapshot = true;

    switch (result) {
        case DeleteResult.NotDeleted:
            // We have not delete anything, we will let browser handle this event
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
                context.skipUndoSnapshot = false;
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
