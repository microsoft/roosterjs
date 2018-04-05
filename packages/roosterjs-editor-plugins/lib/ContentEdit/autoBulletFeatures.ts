import { Browser } from 'roosterjs-editor-dom';
import { ChangeSource } from 'roosterjs-editor-types';
import { ContentEditFeature } from './ContentEditFeatures';
import {
    cacheGetCursorEventData,
    cacheGetListTag,
    getNodeAtCursor,
    toggleBullet,
    toggleNumbering,
    validateAndGetRangeForTextBeforeCursor,
} from 'roosterjs-editor-api';

const KEY_SPACE = 32;

export const AutoBullet: ContentEditFeature = {
    key: KEY_SPACE,
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListTag(event, editor)) {
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
            let listNode: Node;
            let cursorData = cacheGetCursorEventData(event, editor);
            let textBeforeCursor = cursorData.getXCharsBeforeCursor(3);

            // editor.insertContent(NBSP);
            editor.formatWithUndo(
                () => {
                    // Remove the user input '*', '-' or '1.'
                    let rangeToDelete = validateAndGetRangeForTextBeforeCursor(
                        editor,
                        textBeforeCursor + '\u00A0', // Add the &nbsp; we just inputted
                        true /*exactMatch*/,
                        cursorData
                    );
                    if (rangeToDelete) {
                        rangeToDelete.deleteContents();
                    }

                    // If not explicitly insert br, Chrome will operate on the previous line
                    if (Browser.isChrome) {
                        editor.insertContent('<BR>');
                    }

                    if (textBeforeCursor == '1.') {
                        toggleNumbering(editor);
                        listNode = getNodeAtCursor(editor, 'OL');
                    } else {
                        toggleBullet(editor);
                        listNode = getNodeAtCursor(editor, 'UL');
                    }
                },
                false /*preserveSelection*/,
                ChangeSource.AutoBullet,
                () => listNode
            );
        });
        return ChangeSource.AutoBullet;
    },
};