import { clearState } from '../utils/clearState';
import { isCharacterValue } from 'roosterjs-editor-dom';
import { Keys } from 'roosterjs-editor-types';
import type { IEditor, PluginKeyUpEvent } from 'roosterjs-editor-types';
import type { TableCellSelectionState } from '../TableCellSelectionState';

const IGNORE_KEY_UP_KEYS = [
    Keys.SHIFT,
    Keys.ALT,
    Keys.META_LEFT,
    Keys.CTRL_LEFT,
    Keys.PRINT_SCREEN,
];

/**
 * @internal
 */
export function handleKeyUpEvent(
    event: PluginKeyUpEvent,
    state: TableCellSelectionState,
    editor: IEditor
) {
    const { shiftKey, which, ctrlKey } = event.rawEvent;
    if (
        !shiftKey &&
        !ctrlKey &&
        state.firstTarget &&
        !state.preventKeyUp &&
        IGNORE_KEY_UP_KEYS.indexOf(which) == -1
    ) {
        if (isCharacterValue(event.rawEvent)) {
            editor.addUndoSnapshot();
        }
        clearState(state, editor);
    }
    state.preventKeyUp = false;
}
