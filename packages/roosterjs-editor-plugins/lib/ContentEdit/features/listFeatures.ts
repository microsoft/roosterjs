import { ContentEditFeature, GenericContentEditFeature, Keys } from '../ContentEditFeatures';
import { Editor, cacheGetContentSearcher } from 'roosterjs-editor-core';
import { Indentation, PluginKeyboardEvent, ContentChangedEvent } from 'roosterjs-editor-types';
import { Browser, Position, getTagOfNode, isNodeEmpty } from 'roosterjs-editor-dom';
import {
    cacheGetNodeAtCursor,
    getNodeAtCursor,
    setIndentation,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';
import { PositionType } from 'roosterjs-editor-types';

export const IndentWhenTab: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        !event.rawEvent.shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Increase);
        event.rawEvent.preventDefault();
    },
    isAvailable: featureSet => featureSet.indentWhenTab,
};

export const OutdentWhenShiftTab: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Decrease);
        event.rawEvent.preventDefault();
    },
    isAvailable: featureSet => featureSet.outdentWhenShiftTab,
};

export const MergeInNewLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        let range = editor.getSelectionRange();
        return li && range && Position.getStart(range).isAtBeginningOf(li);
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
    isAvailable: featureSet => featureSet.mergeInNewLineWhenBackspaceOnFirstChar,
};

export const OutdentWhenBackOn1stEmptyLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
    isAvailable: featureSet => featureSet.outdentWhenBackspaceOnEmptyFirstLine,
};

export const OutdentWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetNodeAtCursor(editor, event, 'LI');
        return !event.rawEvent.shiftKey && li && isNodeEmpty(li);
    },
    handleEvent: (event, editor) => {
        editor.performAutoComplete(() => toggleListAndPreventDefault(event, editor));
    },
    isAvailable: featureSet => featureSet.outdentWhenEnterOnEmptyLine,
};

export const AutoBullet: ContentEditFeature = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListElement(event, editor)) {
            let searcher = cacheGetContentSearcher(event, editor);
            let textBeforeCursor = searcher.getSubStringBefore(3);

            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return (
                ['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
                !searcher.getNearestNonTextInlineElement()
            );
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.runAsync(() => {
            editor.performAutoComplete(() => {
                let searcher = editor.getContentSearcherOfCursor();
                let textBeforeCursor = searcher.getSubStringBefore(3);
                let rangeToDelete = searcher.getRangeFromText(
                    textBeforeCursor,
                    true /*exactMatch*/
                );

                if (rangeToDelete) {
                    rangeToDelete.deleteContents();
                }

                // If not explicitly insert br, Chrome will operate on the previous line
                let tempBr = editor.getDocument().createElement('BR');
                if (Browser.isChrome || Browser.isSafari) {
                    editor.insertNode(tempBr);
                }

                if (textBeforeCursor.indexOf('1.') == 0) {
                    toggleNumbering(editor);
                } else {
                    toggleBullet(editor);
                }

                editor.deleteNode(tempBr);
            });
        });
    },
    isAvailable: featureSet => featureSet.autoBullet,
};

export function getSmartOrderedList(
    styleList: string[]
): GenericContentEditFeature<ContentChangedEvent> {
    return {
        keys: [Keys.CONTENTCHANGED], // Triggered by ContentChangedEvent
        shouldHandleEvent: (event, editor) => event.data instanceof HTMLOListElement,
        handleEvent: (event, editor) => {
            let ol = event.data as HTMLOListElement;
            let parentOl = getNodeAtCursor(editor, 'OL', ol.parentNode) as HTMLOListElement;
            if (parentOl) {
                // The style list must has at least one value. If no value is passed in, fallback to decimal
                let styles = styleList && styleList.length > 0 ? styleList : ['decimal'];
                ol.style.listStyle =
                    styles[(styles.indexOf(parentOl.style.listStyle) + 1) % styles.length];
            }
        },
        isAvailable: featureSet => featureSet.smartOrderedList,
    };
}

function toggleListAndPreventDefault(event: PluginKeyboardEvent, editor: Editor) {
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

function cacheGetListElement(event: PluginKeyboardEvent, editor: Editor) {
    let li = cacheGetNodeAtCursor(editor, event, ['LI', 'TABLE']);
    let listElement = li && getTagOfNode(li) == 'LI' && getNodeAtCursor(editor, ['UL', 'OL'], li);
    return listElement ? [listElement, li] : null;
}
