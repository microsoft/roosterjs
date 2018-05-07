import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor } from 'roosterjs-editor-core';
import { Indentation, PluginDomEvent } from 'roosterjs-editor-types';
import {
    Browser,
    Position,
    SelectionRange,
    getTagOfNode,
    isNodeEmpty,
    splitParentNode,
    unwrap,
} from 'roosterjs-editor-dom';
import {
    cacheGetCursorEventData,
    cacheGetNodeAtCursor,
    getNodeAtCursor,
    setIndentation,
    toggleBullet,
    toggleNumbering,
    clearCursorEventDataCache,
} from 'roosterjs-editor-api';
import { ChangeSource, PositionType } from 'roosterjs-editor-types';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_SPACE = 32;

export const IndentOutdentWhenTab: ContentEditFeature = {
    key: KEY_TAB,
    shouldHandleEvent: cacheGetListElement,
    handleEvent: (event, editor) => {
        let shift = (event.rawEvent as KeyboardEvent).shiftKey;
        setIndentation(editor, shift ? Indentation.Decrease : Indentation.Increase);
        event.rawEvent.preventDefault();
    },
};

export const MergeInNewLine: ContentEditFeature = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: (event, editor) => {
        let range: SelectionRange;
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return (
            li &&
            (range = editor.getSelectionRange()) &&
            range.collapsed &&
            range.start.offset == 0 &&
            new Position(li, 0).normalize().equalTo(range.start.normalize())
        );
    },
    handleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        if (li.previousSibling) {
            editor.runAsync(() => {
                let document = editor.getDocument();
                let br = document.createElement('br');
                editor.insertNode(br);
                editor.select(br, PositionType.After);
            });
        } else {
            toggleListAndPreventDefault(event, editor);
        }
    },
};

export const OutdentBSEmptyLine1: ContentEditFeature = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
};

export const OutdentWhenEnterOnEmptyLine: ContentEditFeature = {
    key: KEY_ENTER,
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li);
    },
    handleEvent: toggleListAndPreventDefault,
};

export const AutoBullet: ContentEditFeature = {
    key: KEY_SPACE,
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListElement(event, editor)) {
            let cursorData = cacheGetCursorEventData(event, editor);
            let textBeforeCursor = cursorData.getSubStringBeforeCursor(3);

            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return (
                ['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
                !cursorData.getNearestNonTextInlineElement()
            );
        }
        return false;
    },
    handleEvent: (event, editor) => {
        clearCursorEventDataCache(event);
        editor.runAsync(() => {
            let listNode: Node;
            let cursorData = cacheGetCursorEventData(event, editor);
            let textBeforeCursor = cursorData.getSubStringBeforeCursor(3);

            editor.runWithUndo(
                () => {
                    // Remove the user input '*', '-' or '1.'
                    let rangeToDelete = cursorData.getRangeWithForTextBeforeCursor(
                        textBeforeCursor,
                        true /*exactMatch*/
                    );
                    if (rangeToDelete) {
                        rangeToDelete.getRange().deleteContents();
                    }

                    // If not explicitly insert br, Chrome will operate on the previous line
                    if (Browser.isChrome || Browser.isChrome) {
                        editor.insertContent('<BR>');
                    }

                    if (textBeforeCursor.indexOf('1.') == 0) {
                        toggleNumbering(editor);
                        listNode = getNodeAtCursor(editor, 'OL');
                    } else {
                        toggleBullet(editor);
                        listNode = getNodeAtCursor(editor, 'UL');
                    }
                },
                ChangeSource.AutoBullet,
                () => listNode
            );
        });
        return ChangeSource.AutoBullet;
    },
};

function toggleListAndPreventDefault(event: PluginDomEvent, editor: Editor) {
    let listInfo = cacheGetListElement(event, editor);
    if (listInfo) {
        let [listElement, li] = listInfo;
        while (editor.contains(li.parentNode) && li.parentNode != listElement) {
            splitParentNode(li, false);
            splitParentNode(li, true);
            unwrap(li.parentNode);
        }

        editor.select(li);

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
    let li = cacheGetNodeAtCursor(editor, event, 'LI');
    let listElement = li && getNodeAtCursor(editor, ['UL', 'OL'], li);
    return listElement ? [listElement, li] : null;
}
