import getAutoBulletListStyle from '../utils/getAutoBulletListStyle';
import getAutoNumberingListStyle from '../utils/getAutoNumberingListStyle';
import StartEndBlockElement from 'roosterjs-editor-dom/lib/blockElements/StartEndBlockElement';
import {
    blockFormat,
    commitListChains,
    setIndentation,
    toggleBullet,
    toggleNumbering,
    toggleListType,
} from 'roosterjs-editor-api';
import {
    Browser,
    getTagOfNode,
    isNodeEmpty,
    isPositionAtBeginningOf,
    Position,
    VListChain,
    createVListFromRegion,
    isBlockElement,
    cacheGetEventData,
    safeInstanceOf,
    VList,
} from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    IEditor,
    Indentation,
    ListFeatureSettings,
    Keys,
    PluginKeyboardEvent,
    QueryScope,
    RegionBase,
    ListType,
    ExperimentalFeatures,
    PositionType,
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
                vList.writeBack(
                    editor.isFeatureEnabled(ExperimentalFeatures.ReuseAllAncestorListElements)
                );
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
 * MaintainListChainWhenDelete edit feature, provides the ability to indent the list if user press
 * DELETE before the first item of a list
 */
const MaintainListChainWhenDelete: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.DELETE],
    shouldHandleEvent: (event, editor) => {
        const li = editor.getElementAtCursor('LI', null /*startFrom*/, event);
        if (li) {
            return false;
        }
        const isAtEnd = Position.getEnd(editor.getSelectionRange()).isAtEnd;
        const nextSibling = isAtEnd ? getCacheNextSibling(event, editor) : null;
        const isAtEndAndBeforeLI = editor.getElementAtCursor('LI', nextSibling, event);
        return isAtEndAndBeforeLI;
    },
    handleEvent: (event, editor) => {
        const chains = getListChains(editor);
        editor.runAsync(editor => commitListChains(editor, chains));
    },
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
            () => toggleListAndPreventDefault(event, editor, false /* includeSiblingLists */),
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    },
    defaultDisabled: !Browser.isIE && !Browser.isChrome,
};

/**
 * Validate if a block of text is considered a list pattern
 * The regex expression will look for patterns of the form:
 * 1.  1>  1)  1-  (1)
 * @returns if a text is considered a list pattern
 */
function isAListPattern(textBeforeCursor: string) {
    const REGEX: RegExp = /^(\*|-|[0-9]{1,2}\.|[0-9]{1,2}\>|[0-9]{1,2}\)|[0-9]{1,2}\-|\([0-9]{1,2}\))$/;
    return REGEX.test(textBeforeCursor);
}

/**
 * AutoBullet edit feature, provides the ability to automatically convert current line into a list.
 * When user input "1. ", convert into a numbering list
 * When user input "- " or "* ", convert into a bullet list
 */
const AutoBullet: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (
            !cacheGetListElement(event, editor) &&
            !editor.isFeatureEnabled(ExperimentalFeatures.AutoFormatList)
        ) {
            let searcher = editor.getContentSearcherOfCursor(event);
            let textBeforeCursor = searcher.getSubStringBefore(4);

            // Auto list is triggered if:
            // 1. Text before cursor exactly matches '*', '-' or '1.'
            // 2. There's no non-text inline entities before cursor
            return isAListPattern(textBeforeCursor) && !searcher.getNearestNonTextInlineElement();
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
                let textRange = searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/);

                if (!textRange) {
                    // no op if the range can't be found
                } else if (
                    textBeforeCursor.indexOf('*') == 0 ||
                    textBeforeCursor.indexOf('-') == 0
                ) {
                    prepareAutoBullet(editor, textRange);
                    toggleBullet(editor);
                } else if (isAListPattern(textBeforeCursor)) {
                    prepareAutoBullet(editor, textRange);
                    toggleNumbering(editor);
                } else if ((regions = editor.getSelectedRegions()) && regions.length == 1) {
                    const num = parseInt(textBeforeCursor);
                    prepareAutoBullet(editor, textRange);
                    toggleNumbering(editor, num);
                }
                searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/)?.deleteContents();
            },
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    },
};

/**
 * Requires @see ExperimentalFeatures.AutoFormatList to be enabled
 * AutoBulletList edit feature, provides the ability to automatically convert current line into a bullet list.
 */
const AutoBulletList: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (
            !cacheGetListElement(event, editor) &&
            editor.isFeatureEnabled(ExperimentalFeatures.AutoFormatList)
        ) {
            return shouldTriggerList(event, editor, getAutoBulletListStyle);
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.insertContent('&nbsp;');
        event.rawEvent.preventDefault();
        editor.addUndoSnapshot(
            () => {
                let searcher = editor.getContentSearcherOfCursor();
                let textBeforeCursor = searcher.getSubStringBefore(5);
                let textRange = searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/);
                const listStyle = getAutoBulletListStyle(textBeforeCursor);

                if (textRange) {
                    prepareAutoBullet(editor, textRange);
                    toggleBullet(editor, listStyle, 'autoToggleList' /** apiNameOverride */);
                }
                searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/)?.deleteContents();
            },
            null /*changeSource*/,
            true /*canUndoByBackspace*/
        );
    },
};

/**
 * Requires @see ExperimentalFeatures.AutoFormatList to be enabled
 * AutoNumberingList edit feature, provides the ability to automatically convert current line into a numbering list.
 */
const AutoNumberingList: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.SPACE],
    shouldHandleEvent: (event, editor) => {
        if (
            !cacheGetListElement(event, editor) &&
            editor.isFeatureEnabled(ExperimentalFeatures.AutoFormatList)
        ) {
            return shouldTriggerList(event, editor, getAutoNumberingListStyle);
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.insertContent('&nbsp;');
        event.rawEvent.preventDefault();
        editor.addUndoSnapshot(
            () => {
                const searcher = editor.getContentSearcherOfCursor();
                const textBeforeCursor = searcher.getSubStringBefore(5);
                const textRange = searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/);

                if (textRange) {
                    const number = parseInt(textBeforeCursor);
                    const previousNode = editor
                        .getBodyTraverser(textRange.startContainer)
                        .getPreviousBlockElement();
                    const isLi = previousNode
                        ? getTagOfNode(previousNode?.collapseToSingleElement()) === 'LI'
                        : false;
                    const listStyle = getAutoNumberingListStyle(textBeforeCursor);
                    prepareAutoBullet(editor, textRange);
                    toggleNumbering(
                        editor,
                        isLi ? undefined : number /** startNumber */,
                        listStyle,
                        'autoToggleList' /** apiNameOverride */
                    );
                }
                searcher.getRangeFromText(textBeforeCursor, true /*exactMatch*/)?.deleteContents();
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
        editor.runAsync(editor => commitListChains(editor, chains));
    },
};

function getListChains(editor: IEditor) {
    return VListChain.createListChains(editor.getSelectedRegions());
}

function getCacheNextSibling(event: PluginKeyboardEvent, editor: IEditor): Node | undefined {
    const element = cacheGetEventData(event, 'nextSibling', () => {
        const range = editor.getSelectionRange();
        const pos = Position.getEnd(range).normalize();
        const traverser = editor.getBodyTraverser(pos.node);
        return traverser?.getNextBlockElement()?.getStartNode();
    });
    return element;
}

function prepareAutoBullet(editor: IEditor, range: Range) {
    const block = editor.getBlockElementAtNode(range.startContainer);
    const endNode = block?.getEndNode();
    if (endNode && getTagOfNode(endNode) != 'BR') {
        const br = editor.getDocument().createElement('BR');
        if (isBlockElement(endNode)) {
            endNode.appendChild(br);
        } else {
            endNode.parentNode.insertBefore(br, endNode.nextSibling);
        }
        editor.select(range.startContainer, range.startOffset);
    }
}

function toggleListAndPreventDefault(
    event: PluginKeyboardEvent,
    editor: IEditor,
    includeSiblingLists: boolean = true
) {
    let listInfo = cacheGetListElement(event, editor);
    if (listInfo) {
        let listElement = listInfo[0];
        let tag = getTagOfNode(listElement);

        if (tag == 'UL' || tag == 'OL') {
            toggleListType(
                editor,
                tag == 'UL' ? ListType.Unordered : ListType.Ordered,
                null /* startNumber */,
                includeSiblingLists
            );
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

function shouldTriggerList(
    event: PluginKeyboardEvent,
    editor: IEditor,
    getListStyle: (text: string, previousListChain?: VListChain[]) => number
) {
    const searcher = editor.getContentSearcherOfCursor(event);
    const textBeforeCursor = searcher.getSubStringBefore(4);
    const itHasSpace = /\s/g.test(textBeforeCursor);
    const listChains = getListChains(editor);
    return (
        !itHasSpace &&
        !searcher.getNearestNonTextInlineElement() &&
        getListStyle(textBeforeCursor, listChains)
    );
}

/**
 * MergeListOnBackspaceAfterList edit feature, provides the ability to merge list on backspace on block after a list.
 */
const MergeListOnBackspaceAfterList: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        const target = editor.getElementAtCursor();
        const range = editor.getSelectionRange();
        if (range && range.collapsed && target) {
            const cursorBlock = StartEndBlockElement.getBlockContext(target);
            const previousBlock = cursorBlock?.previousElementSibling ?? null;

            const tempBlock = cursorBlock?.nextElementSibling;
            const nextBlock = isList(tempBlock) ? tempBlock : tempBlock?.firstChild;

            if (isList(previousBlock) && isList(nextBlock)) {
                const element = cacheGetEventData<HTMLOListElement | HTMLUListElement>(
                    event,
                    'previousBlock',
                    () => previousBlock
                );
                const nextElement = cacheGetEventData<HTMLOListElement | HTMLUListElement>(
                    event,
                    'nextBlock',
                    () => nextBlock
                );

                return !!element && !!nextElement;
            }
        }
        return false;
    },
    handleEvent: (event, editor) => {
        editor.runAsync(editor => {
            const previousList = cacheGetEventData<HTMLOListElement | HTMLUListElement | null>(
                event,
                'previousBlock',
                () => null
            );
            const targetBlock = cacheGetEventData<HTMLOListElement | HTMLUListElement | null>(
                event,
                'nextBlock',
                () => null
            );

            const rangeBeforeWriteBack = editor.getSelectionRange();

            if (previousList && targetBlock && rangeBeforeWriteBack) {
                const fvList = new VList(previousList);
                fvList.mergeVList(new VList(targetBlock));

                let span = document.createElement('span');
                span.id = 'restoreRange';
                rangeBeforeWriteBack.insertNode(span);

                fvList.writeBack();

                span = editor.queryElements('#restoreRange')[0];

                if (span.parentElement) {
                    editor.select(new Position(span, PositionType.After));
                    span.parentElement.removeChild(span);
                }
            }
        });
    },
};

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
    maintainListChainWhenDelete: MaintainListChainWhenDelete,
    autoNumberingList: AutoNumberingList,
    autoBulletList: AutoBulletList,
    mergeListOnBackspaceAfterList: MergeListOnBackspaceAfterList,
};

function isList(element: Node | null | undefined): element is HTMLOListElement | HTMLOListElement {
    return (
        !!element &&
        (safeInstanceOf(element, 'HTMLOListElement') || safeInstanceOf(element, 'HTMLUListElement'))
    );
}
