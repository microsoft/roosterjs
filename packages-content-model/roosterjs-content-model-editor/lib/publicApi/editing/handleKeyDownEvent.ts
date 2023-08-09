import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource, Keys } from 'roosterjs-editor-types';
import { deleteAllSegmentBefore } from '../../modelApi/edit/deleteSteps/deleteAllSegmentBefore';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { DeleteSelectionStep } from '../../modelApi/edit/utils/DeleteSelectionStep';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    handleKeyboardEventResult,
    shouldDeleteAllSegmentsBefore,
    shouldDeleteWord,
} from '../../editor/utils/handleKeyboardEventCommon';
import {
    backwardDeleteWordSelection,
    forwardDeleteWordSelection,
} from '../../modelApi/edit/deleteSteps/deleteWordSelection';
import {
    backwardDeleteCollapsedSelection,
    forwardDeleteCollapsedSelection,
} from '../../modelApi/edit/deleteSteps/deleteCollapsedSelection';

/**
 * @internal
 * Handle KeyDown event
 * Currently only DELETE and BACKSPACE keys are supported
 */
export default function handleKeyDownEvent(editor: IContentModelEditor, rawEvent: KeyboardEvent) {
    const which = rawEvent.which;

    formatWithContentModel(
        editor,
        which == Keys.DELETE ? 'handleDeleteKey' : 'handleBackspaceKey',
        (model, context) => {
            const result = deleteSelection(model, getDeleteSteps(rawEvent), context).deleteResult;

            return handleKeyboardEventResult(editor, model, rawEvent, result, context);
        },
        {
            rawEvent,
            changeSource: ChangeSource.Keyboard,
            getChangeData: () => which,
        }
    );
}

function getDeleteSteps(rawEvent: KeyboardEvent): (DeleteSelectionStep | null)[] {
    const isForward = rawEvent.which == Keys.DELETE;
    const deleteAllSegmentBeforeStep =
        shouldDeleteAllSegmentsBefore(rawEvent) && !isForward ? deleteAllSegmentBefore : null;
    const deleteWordSelection = shouldDeleteWord(rawEvent, !!Browser.isMac)
        ? isForward
            ? forwardDeleteWordSelection
            : backwardDeleteWordSelection
        : null;
    const deleteCollapsedSelection = isForward
        ? forwardDeleteCollapsedSelection
        : backwardDeleteCollapsedSelection;
    return [deleteAllSegmentBeforeStep, deleteWordSelection, deleteCollapsedSelection];
}
