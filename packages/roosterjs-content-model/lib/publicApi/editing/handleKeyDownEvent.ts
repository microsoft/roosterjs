import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, EntityOperationEvent, Keys, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { deleteAllSegmentBefore } from '../../modelApi/edit/steps/deleteAllSegmentBefore';
import { deleteSelection, DeleteSelectionResult } from '../../modelApi/edit/deleteSelection';
import { EditEntry } from '../../modelApi/edit/utils/EditStep';
import { EditStep } from '../../modelApi/edit/utils/EditStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeContentModel } from '../../modelApi/common/normalizeContentModel';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../modelApi/edit/steps/deleteWordSelection';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../modelApi/edit/steps/deleteCollapsedSelection';

/**
 * Handle KeyDown event
 * Currently only DELETE and BACKSPACE keys are supported
 */
export default function handleKeyDownEvent(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[]
) {
    const which = rawEvent.which;

    if (which == Keys.DELETE || which == Keys.BACKSPACE) {
        const isForward = which == Keys.DELETE;
        const apiName = isForward ? 'handleDeleteKey' : 'handleBackspaceKey';
        const deleteCollapsedSelection = isForward
            ? forwardDeleteCollapsedSelection
            : backwardDeleteCollapsedSelection;
        const deleteWordSelection = shouldDeleteWord(rawEvent)
            ? isForward
                ? forwardDeleteWordSelection
                : backwardDeleteWordSelection
            : null;
        let result: DeleteSelectionResult | undefined;

        formatWithContentModel(
            editor,
            apiName,
            model => {
                const additionalSteps: (EditStep | null)[] = [
                    shouldDeleteAllSegmentsBefore(rawEvent) ? deleteAllSegmentBefore : null,
                    deleteWordSelection,
                    deleteCollapsedSelection,
                ].filter(x => !!x);

                result = deleteSelection(model, {
                    onDeleteEntity: getOnDeleteEntityCallback(
                        editor,
                        rawEvent,
                        triggeredEntityEvents
                    ),
                    additionalSteps,
                });

                handleKeyboardEventResult(editor, model, rawEvent, result.isChanged);

                return result.isChanged;
            },
            {
                skipUndoSnapshot: true, // No need to add undo snapshot for each key down event. We will trigger a ContentChanged event and let UndoPlugin decide when to add undo snapshot
                changeSource: ChangeSource.Keyboard,
                getChangeData: () => which,
            }
        );

        if (result?.addUndoSnapshot) {
            editor.addUndoSnapshot();
        }
    }
}

/**
 * @internal
 * export for test only
 */
export function getOnDeleteEntityCallback(
    editor: IContentModelEditor,
    rawEvent: KeyboardEvent,
    triggeredEntityEvents: EntityOperationEvent[]
): EditEntry {
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

        return rawEvent.defaultPrevented;
    };
}

/**
 * @internal
 * export for test only
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

function shouldDeleteWord(rawEvent: KeyboardEvent) {
    const mac = Browser.isMac;

    return (mac && rawEvent.altKey && rawEvent.metaKey) || (!mac && rawEvent.ctrlKey);
}

function shouldDeleteAllSegmentsBefore(rawEvent: KeyboardEvent) {
    return rawEvent.metaKey && !rawEvent.altKey;
}
