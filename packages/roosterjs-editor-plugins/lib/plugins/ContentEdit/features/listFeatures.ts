import { setIndentation, toggleBullet, toggleNumbering } from 'roosterjs-editor-api';
import {
    ContentEditFeature,
    IEditor,
    Indentation,
    ListFeatureSettings,
    Keys,
    NodeType,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';
import {
    Browser,
    getTagOfNode,
    isNodeEmpty,
    isPositionAtBeginningOf,
    Position,
} from 'roosterjs-editor-dom';

/**
 * IndentWhenTab edit feature, provides the ability to indent current list when user press TAB
 */
const IndentWhenTab: ContentEditFeature = {
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
const OutdentWhenShiftTab: ContentEditFeature = {
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
const MergeInNewLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        let range = editor.getSelectionRange();
        return li && range && isPositionAtBeginningOf(Position.getStart(range), li);
    },
    handleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
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
    defaultDisabled: true,
};

/**
 * OutdentWhenBackOn1stEmptyLine edit feature, provides the ability to outdent current item if user press
 * BACKSPACE at the first and empty line of a list
 */
const OutdentWhenBackOn1stEmptyLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        return li && isNodeEmpty(li) && !li.previousSibling;
    },
    handleEvent: toggleListAndPreventDefault,
};

/**
 * OutdentWhenEnterOnEmptyLine edit feature, provides the ability to outdent current item if user press
 * ENTER at the beginning of an empty line of a list
 */
const OutdentWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        return !event.rawEvent.shiftKey && li && isNodeEmpty(li);
    },
    handleEvent: (event, editor) => {
        editor.addUndoSnapshot(
            () => toggleListAndPreventDefault(event, editor),
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    },
    defaultDisabled: !Browser.isIE && !Browser.isChrome,
};

/**
 * AutoBullet edit feature, provides the ablility to automatically convert current line into a list.
 * When user input "1. ", convert into a numbering list
 * When user input "- " or "* ", convert into a bullet list
 */
const AutoBullet: ContentEditFeature = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListElement(event, editor)) {
            let searcher = editor.getContentSearcherOfCursor(event);
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
            editor.addUndoSnapshot(
                () => {
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
                },
                null /*changeSource*/,
                true /*canUndoByBackspace*/
            );
        });
    },
};

function toggleListAndPreventDefault(event: PluginKeyboardEvent, editor: IEditor) {
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

function cacheGetListElement(event: PluginKeyboardEvent, editor: IEditor) {
    let li = editor.getElementAtCursor('LI,TABLE', null /*startFrom*/, event);
    let listElement = li && getTagOfNode(li) == 'LI' && editor.getElementAtCursor('UL,OL', li);
    return listElement ? [listElement, li] : null;
}

/**
 * @internal
 */
export const ListFeatures: Record<keyof ListFeatureSettings, ContentEditFeature> = {
    autoBullet: AutoBullet,
    indentWhenTab: IndentWhenTab,
    outdentWhenShiftTab: OutdentWhenShiftTab,
    outdentWhenBackspaceOnEmptyFirstLine: OutdentWhenBackOn1stEmptyLine,
    outdentWhenEnterOnEmptyLine: OutdentWhenEnterOnEmptyLine,
    mergeInNewLineWhenBackspaceOnFirstChar: MergeInNewLine,
};
