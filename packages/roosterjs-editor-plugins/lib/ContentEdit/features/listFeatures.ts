import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor } from 'roosterjs-editor-core';
import { Indentation, PluginDomEvent } from 'roosterjs-editor-types';
import { Browser, getTagOfNode, isNodeEmpty, isPositionAtBeginningOf } from 'roosterjs-editor-dom';
import {
    cacheGetCursorEventData,
    cacheGetNodeAtCursor,
    getNodeAtCursor,
    setIndentation,
    toggleBullet,
    toggleNumbering,
    validateAndGetRangeForTextBeforeCursor,
} from 'roosterjs-editor-api';
import { ChangeSource, PositionType } from 'roosterjs-editor-types';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SPACE = 32;

export const IndentWhenTab: ContentEditFeature = {
    keys: [KEY_TAB],
    shouldHandleEvent: (event, editor) =>
        !(event.rawEvent as KeyboardEvent).shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Increase);
        event.rawEvent.preventDefault();
    },
};

export const OutdentWhenShiftTab: ContentEditFeature = {
    keys: [KEY_TAB],
    shouldHandleEvent: (event, editor) =>
        (event.rawEvent as KeyboardEvent).shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Decrease);
        event.rawEvent.preventDefault();
    },
};

export const MergeInNewLine: ContentEditFeature = {
    keys: [KEY_BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isPositionAtBeginningOf(editor.getSelectionRange(), li);
    },
    handleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        if (li.previousSibling) {
            editor.runAsync(() => {
                let br = editor.getDocument().createElement('BR');
                editor.insertNode(br);
                editor.select(br, PositionType.After);
            });
        } else {
            toggleListAndPreventDefault(event, editor);
        }
    },
};

export const OutdentWhenBackOn1stEmptyLine: ContentEditFeature = {
    keys: [KEY_BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
};

export const OutdentWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [KEY_ENTER],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li);
    },
    handleEvent: (event, editor) => {
        editor.performAutoComplete(() => toggleListAndPreventDefault(event, editor));
    },
};

export const AutoBullet: ContentEditFeature = {
    keys: [KEY_SPACE],
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListElement(event, editor)) {
            let cursorData = cacheGetCursorEventData(event, editor);
            let textBeforeCursor = cursorData.getXCharsBeforeCursor(3);

            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return (
                ['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
                !cursorData.getFirstNonTextInlineBeforeCursor()
            );
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.runAsync(() => {
            editor.performAutoComplete(() => {
                let cursorData = cacheGetCursorEventData(
                    null /*pass null for event, force get fresh CursorData*/,
                    editor
                );
                let textBeforeCursor = cursorData.getXCharsBeforeCursor(3);
                let rangeToDelete = validateAndGetRangeForTextBeforeCursor(
                    editor,
                    textBeforeCursor,
                    true /*exactMatch*/,
                    cursorData
                );

                if (rangeToDelete) {
                    rangeToDelete.deleteContents();
                }

                // If not explicitly insert br, Chrome will operate on the previous line
                let tempBr = editor.getDocument().createElement('BR');
                if (Browser.isChrome || Browser.isSafari) {
                    editor.insertNode(tempBr);
                }

                let listNode: Node;

                if (textBeforeCursor.indexOf('1.') == 0) {
                    toggleNumbering(editor);
                    listNode = getNodeAtCursor(editor, 'OL');
                } else {
                    toggleBullet(editor);
                    listNode = getNodeAtCursor(editor, 'UL');
                }

                editor.deleteNode(tempBr);
                return listNode;
            }, ChangeSource.AutoBullet);
        });
    },
};

function toggleListAndPreventDefault(event: PluginDomEvent, editor: Editor) {
    let listInfo = cacheGetListElement(event, editor);
    if (listInfo) {
        let listElement = listInfo[0];
        let tag = getTagOfNode(listElement);
        if (tag == 'UL') {
            toggleBullet(editor);
        } else if (tag == 'OL') {
            toggleNumbering(editor);
        }
        editor.focus();
        event.rawEvent.preventDefault();
    }
}

function cacheGetListElement(event: PluginDomEvent, editor: Editor) {
    let li = cacheGetNodeAtCursor(editor, event, ['LI', 'TABLE']);
    let listElement = li && getTagOfNode(li) == 'LI' && getNodeAtCursor(editor, ['UL', 'OL'], li);
    return listElement ? [listElement, li] : null;
}
