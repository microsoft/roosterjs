import blockFormat from 'roosterjs-editor-api/lib/utils/blockFormat';
import {
    experimentCommitListChains,
    setIndentation,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';
import {
    Browser,
    getTagOfNode,
    isNodeEmpty,
    isPositionAtBeginningOf,
    Position,
    VListChain,
    createVListFromRegion,
} from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    IEditor,
    Indentation,
    ListFeatureSettings,
    Keys,
    NodeType,
    PluginKeyboardEvent,
    PositionType,
    QueryScope,
    RegionBase,
} from 'roosterjs-editor-types';

/**
 * IndentWhenTab edit feature, provides the ability to indent current list when user press TAB
 */
const IndentWhenTab: BuildInEditFeature<PluginKeyboardEvent> = {
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
const OutdentWhenShiftTab: BuildInEditFeature<PluginKeyboardEvent> = {
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
const MergeInNewLine: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        let range = editor.getSelectionRange();
        return li && range?.collapsed && isPositionAtBeginningOf(Position.getStart(range), li);
    },
    handleEvent: (event, editor) => {
        let li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        if (li.previousSibling) {
            blockFormat(editor, (region, start, end) => {
                const vList = createVListFromRegion(region, false /*includeSiblingList*/, li);
                vList.setIndentation(start, end, Indentation.Decrease, true /*softOutdent*/);
                vList.writeBack();
                event.rawEvent.preventDefault();
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
const OutdentWhenBackOn1stEmptyLine: BuildInEditFeature<PluginKeyboardEvent> = {
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
const OutdentWhenEnterOnEmptyLine: BuildInEditFeature<PluginKeyboardEvent> = {
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
const AutoBullet: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (!cacheGetListElement(event, editor)) {
            let searcher = editor.getContentSearcherOfCursor(event);
            let textBeforeCursor = searcher.getSubStringBefore(4);

            // Auto list is triggered if:
            // 1. Text before cursor exactly mathces '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return (
                /^(\*|-|[0-9]{1,2}\.)$/.test(textBeforeCursor) &&
                !searcher.getNearestNonTextInlineElement()
            );
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.insertContent('&nbsp;');
        event.rawEvent.preventDefault();
        editor.addUndoSnapshot(
            () => {
                let regions: RegionBase[];
                let searcher = editor.getContentSearcherOfCursor();
                let textBeforeCursor = searcher.getSubStringBefore(4);
                let rangeToDelete = searcher.getRangeFromText(
                    textBeforeCursor,
                    true /*exactMatch*/
                );

                if (!rangeToDelete) {
                    // no op if the range can't be found
                } else if (
                    textBeforeCursor.indexOf('*') == 0 ||
                    textBeforeCursor.indexOf('-') == 0
                ) {
                    prepareAutoBullet(editor, rangeToDelete);
                    toggleBullet(editor);
                } else if (textBeforeCursor.indexOf('1.') == 0) {
                    prepareAutoBullet(editor, rangeToDelete);
                    toggleNumbering(editor);
                } else if ((regions = editor.getSelectedRegions()) && regions.length == 1) {
                    const num = parseInt(textBeforeCursor);
                    prepareAutoBullet(editor, rangeToDelete);
                    toggleNumbering(editor, num);
                }
            },
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    },
};

/**
 * Maintain the list numbers in list chain
 * e.g. we have two lists:
 * 1, 2, 3 and 4, 5, 6
 * Now we delete list item 2, so the first one becomes "1, 2".
 * This edit feature can maintain the list number of the second list to become "3, 4, 5"
 */
const MaintainListChain: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ENTER, Keys.TAB, Keys.DELETE, Keys.BACKSPACE, Keys.RANGE],
    shouldHandleEvent: (event, editor) =>
        editor.queryElements('li', QueryScope.OnSelection).length > 0,
    handleEvent: (event, editor) => {
        const chains = getListChains(editor);
        editor.runAsync(editor => experimentCommitListChains(editor, chains));
    },
};

function getListChains(editor: IEditor) {
    return VListChain.createListChains(editor.getSelectedRegions());
}

function prepareAutoBullet(editor: IEditor, range: Range) {
    range.deleteContents();
    const node = range.startContainer;
    if (node?.nodeType == NodeType.Text && node.nodeValue == '' && !node.nextSibling) {
        const br = editor.getDocument().createElement('BR');
        editor.insertNode(br);
        editor.select(br, PositionType.Before);
    }
}

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
export const ListFeatures: Record<
    keyof ListFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    autoBullet: AutoBullet,
    indentWhenTab: IndentWhenTab,
    outdentWhenShiftTab: OutdentWhenShiftTab,
    outdentWhenBackspaceOnEmptyFirstLine: OutdentWhenBackOn1stEmptyLine,
    outdentWhenEnterOnEmptyLine: OutdentWhenEnterOnEmptyLine,
    mergeInNewLineWhenBackspaceOnFirstChar: MergeInNewLine,
    maintainListChain: MaintainListChain,
};
