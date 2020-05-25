import { getTagOfNode, isNodeEmpty, isPositionAtBeginningOf, Position } from 'roosterjs-editor-dom';
import { isHTMLOListElement } from 'roosterjs-cross-window';
import { setIndentation, toggleBullet, toggleNumbering } from 'roosterjs-editor-api';
import {
    cacheGetContentSearcher,
    cacheGetElementAtCursor,
    Editor,
    ContentEditFeature,
    GenericContentEditFeature,
    Keys,
} from 'roosterjs-editor-core';
import {
    ContentChangedEvent,
    Indentation,
    PluginKeyboardEvent,
    PositionType,
    NodeType,
} from 'roosterjs-editor-types';

/**
 * IndentWhenTab edit feature, provides the ability to indent current list when user press TAB
 */
export const IndentWhenTab: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        !event.rawEvent.shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Increase);
        event.rawEvent.preventDefault();
    },
};

/**
 * OutdentWhenShiftTab edit feature, provides the ability to outdent current list when user press Shift+TAB
 */
export const OutdentWhenShiftTab: ContentEditFeature = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        event.rawEvent.shiftKey && cacheGetListElement(event, editor),
    handleEvent: (event, editor) => {
        setIndentation(editor, Indentation.Decrease);
        event.rawEvent.preventDefault();
    },
};

/**
 * MergeInNewLine edit feature, provides the ability to merge current line into a new line when user press
 * BACKSPACE at beginning of a list item
 */
export const MergeInNewLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetElementAtCursor(editor, event, 'LI');
        let range = editor.getSelectionRange();
        return li && range && isPositionAtBeginningOf(Position.getStart(range), li);
    },
    handleEvent: (event, editor) => {
        let li = cacheGetElementAtCursor(editor, event, 'LI');
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

/**
 * OutdentWhenBackOn1stEmptyLine edit feature, provides the ability to outdent current item if user press
 * BACKSPACE at the first and empty line of a list
 */
export const OutdentWhenBackOn1stEmptyLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetElementAtCursor(editor, event, 'LI');
        return li && isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
};

/**
 * OutdentWhenEnterOnEmptyLine edit feature, provides the ability to outdent current item if user press
 * ENTER at the beginning of an empty line of a list
 */
export const OutdentWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let li = cacheGetElementAtCursor(editor, event, 'LI');
        return !event.rawEvent.shiftKey && li && isNodeEmpty(li);
    },
    handleEvent: (event, editor) => {
        editor.performAutoComplete(() => toggleListAndPreventDefault(event, editor));
    },
};

/**
 * AutoBullet edit feature, provides the ablility to automatically convert current line into a list.
 * When user input "1. ", convert into a numbering list
 * When user input "- " or "* ", convert into a bullet list
 */
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
                    const node = rangeToDelete.startContainer;
                    if (
                        node?.nodeType == NodeType.Text &&
                        node.nodeValue == '' &&
                        !node.previousSibling &&
                        !node.nextSibling
                    ) {
                        const br = editor.getDocument().createElement('BR');
                        editor.insertNode(br);
                        editor.select(br, PositionType.Before);
                    }
                }

                if (textBeforeCursor.indexOf('1.') == 0) {
                    toggleNumbering(editor);
                } else {
                    toggleBullet(editor);
                }
            });
        });
    },
};

/**
 * Get an instance of SmartOrderedList edit feature. This feature provides the ability to use different
 * number style for different level of numbering list.
 * @param styleList The list of number styles used for this feature.
 * See https://www.w3schools.com/cssref/pr_list-style-type.asp for more information
 */
export function getSmartOrderedList(
    styleList: string[]
): GenericContentEditFeature<ContentChangedEvent> {
    return {
        keys: [Keys.CONTENTCHANGED], // Triggered by ContentChangedEvent
        shouldHandleEvent: (event, editor) => isHTMLOListElement(event.data),
        handleEvent: (event, editor) => {
            let ol = event.data as HTMLOListElement;
            let parentOl = editor.getElementAtCursor('OL', ol.parentNode) as HTMLOListElement;
            if (parentOl) {
                // The style list must has at least one value. If no value is passed in, fallback to decimal
                let styles = styleList && styleList.length > 0 ? styleList : ['decimal'];
                ol.style.listStyle =
                    styles[(styles.indexOf(parentOl.style.listStyle) + 1) % styles.length];
            }
        },
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
    let li = cacheGetElementAtCursor(editor, event, 'LI,TABLE');
    let listElement = li && getTagOfNode(li) == 'LI' && editor.getElementAtCursor('UL,OL', li);
    return listElement ? [listElement, li] : null;
}
