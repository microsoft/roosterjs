import { PluginEvent, PluginEventType, ContentPosition } from 'roosterjs-editor-types';
import {
    cacheGetCursorEventData,
    cacheGetListTag,
    toggleBullet,
    toggleNumbering,
    validateAndGetRangeForTextBeforeCursor,
    CursorData,
} from 'roosterjs-editor-api';
import { Editor, browserData } from 'roosterjs-editor-core';

const KEY_SPACE = 32;

/**
 * Handles the autoBullet event. Specifically, when user press space after input '*', '-' and '1.' in an empty line,
 * we automatically convert it to an html list
 * @param editor The editor instance
 * @param event The plugin event
 * @param keyboardEvent The keyboar event
 * @returns True if it is an autoBullet event, false otherwise
 */
export default function tryHandleAutoBullet(
    editor: Editor,
    event: PluginEvent,
    keyboardEvent: KeyboardEvent
): boolean {
    if (event.eventType == PluginEventType.KeyDown) {
        if (
            keyboardEvent.which == KEY_SPACE &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey
        ) {
            let cursorData = cacheGetCursorEventData(event, editor);

            // We pick 3 characters before cursor so that if any characters exist before "1." or "*",
            // we do not fire auto list.
            let textBeforeCursor: string = cursorData.getXCharsBeforeCursor(3);

            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. Cursor is not in html list
            // 3. There's no non-text inline entities before cursor
            if (
                isAutoBulletInput(textBeforeCursor) &&
                cacheGetListTag(editor, event) == '' &&
                !cursorData.getFirstNonTextInlineBeforeCursor()
            ) {
                handleAutoBulletOrNumbering(textBeforeCursor, editor);
                return true;
            }
        }
    }

    return false;
}

function handleAutoBulletOrNumbering(identifier: string, editor: Editor) {
    let document = editor.getDocument();
    let spaceNode = document.createTextNode(' ');

    editor.insertNode(spaceNode, {
        position: ContentPosition.SelectionStart,
        updateCursor: true,
        replaceSelection: false,
        insertOnNewLine: false,
    });

    editor.formatWithUndo(() => {
        // Remove the user input '*', '-' or '1.'
        let rangeToDelete: Range = validateAndGetRangeForTextBeforeCursor(
            editor,
            identifier + ' ',
            true,
            new CursorData(editor)
        );
        if (rangeToDelete) {
            rangeToDelete.deleteContents();
        }

        // If not explicitly insert br, Chrome will operate on the previous line
        if (browserData.isChrome) {
            let brNode = document.createElement('br');
            editor.insertNode(brNode, {
                position: ContentPosition.SelectionStart,
                updateCursor: true,
                replaceSelection: false,
                insertOnNewLine: false,
            });
        }

        if (identifier == '*' || identifier == '-') {
            toggleBullet(editor);
        } else if (identifier == '1.') {
            toggleNumbering(editor);
        }
    });
}

function isAutoBulletInput(input: string): boolean {
    return ['*', '-', '1.'].indexOf(input) >= 0;
}
