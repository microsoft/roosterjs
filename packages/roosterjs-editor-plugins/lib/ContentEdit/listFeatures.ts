import { ContentEditFeature } from './ContentEditFeatures';
import { Editor } from 'roosterjs-editor-core';
import { Indentation, PluginDomEvent } from 'roosterjs-editor-types';
import { Position, SelectionRange, isNodeEmpty } from 'roosterjs-editor-dom';
import {
    cacheGetListTag,
    cacheGetNodeAtCursor,
    setIndentation,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';

const KEY_BACKSPACE = 8;
const KEY_TAB = 9;
const KEY_ENTER = 13;

export const IndentOutdentWhenTab: ContentEditFeature = {
    key: KEY_TAB,
    shouldHandleEvent: cacheGetListTag,
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
                editor.select(br, Position.After);
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

function toggleListAndPreventDefault(event: PluginDomEvent, editor: Editor) {
    let tag = cacheGetListTag(event, editor);

    if (tag == 'UL') {
        toggleBullet(editor);
    } else if (tag == 'OL') {
        toggleNumbering(editor);
    }
    event.rawEvent.preventDefault();
}
