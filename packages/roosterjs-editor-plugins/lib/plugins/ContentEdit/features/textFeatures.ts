import { setIndentation } from 'roosterjs-editor-api';
import {
    cacheGetEventData,
    createRange,
    safeInstanceOf,
    Position,
    queryElements,
} from 'roosterjs-editor-dom';
import {
    BuildInEditFeature,
    IEditor,
    Indentation,
    TextFeatureSettings,
    Keys,
    PluginKeyboardEvent,
    SelectionRangeTypes,
    ContentPosition,
    PositionType,
    ExperimentalFeatures,
    NodePosition,
    QueryScope,
} from 'roosterjs-editor-types';

const FOCUS_NEXT_ELEMENT_KEY = 'FocusNextElement';
const TAB_SPACES = 6;

/**
 * Requires @see ExperimentalFeatures.TabKeyTextFeatures to be enabled
 * Provides additional functionality when press Tab:
 *      If Whole Paragraph selected, indent paragraph,
 *      If range is collapsed, add tab spaces
 *      If range is not collapsed but not all the paragraph is selected, replace selection with Tab spaces
 *      If there are more than one block in the selection, indent all selection
 */
const IndentWhenTabText: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) =>
        editor.isFeatureEnabled(ExperimentalFeatures.TabKeyTextFeatures) &&
        !event.rawEvent.shiftKey &&
        !editor.getElementAtCursor('LI,TABLE', null /*startFrom*/, event),
    handleEvent: (event, editor) => {
        const selection = editor.getSelectionRangeEx();
        if (selection.type == SelectionRangeTypes.Normal) {
            editor.addUndoSnapshot(() => {
                if (selection.areAllCollapsed) {
                    insertTab(editor, event);
                } else {
                    const { ranges } = selection;
                    const range = ranges[0];
                    if (shouldIndent(editor, range)) {
                        setIndentation(editor, Indentation.Increase);
                    } else {
                        const tempRange = createRange(range.startContainer, range.startOffset);
                        ranges.forEach(range => range.deleteContents());
                        editor.select(tempRange);
                        insertTab(editor, event);
                    }
                }
            });

            event.rawEvent.preventDefault();
        }
    },
};

/**
 * Requires @see ExperimentalFeatures.TabKeyTextFeatures to be enabled
 * If Whole Paragraph selected, outdent paragraph on Tab press
 */
const OutdentWhenTabText: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.TAB],
    shouldHandleEvent: (event, editor) => {
        const selection = editor.getSelectionRangeEx();

        return (
            editor.isFeatureEnabled(ExperimentalFeatures.TabKeyTextFeatures) &&
            selection.type == SelectionRangeTypes.Normal &&
            !selection.areAllCollapsed &&
            event.rawEvent.shiftKey &&
            editor.getElementAtCursor('blockquote', null, event) &&
            !editor.getElementAtCursor('LI,TABLE', null /*startFrom*/, event) &&
            shouldIndent(editor, selection.ranges[0])
        );
    },
    handleEvent: (event, editor) => {
        editor.addUndoSnapshot(() => setIndentation(editor, Indentation.Decrease));

        event.rawEvent.preventDefault();
    },
};

/**
 * Requires @see ExperimentalFeatures.TabKeyTextFeatures to be enabled also,
 *          Assign a getter function to the getCustomData With the Key: FocusNextElementKey, to retrieve the element that
 *          Should be the next focus
 * When press Alt + F10, move the focus to the next element provided by getCustom Data with Key: FocusNextElement
 */
const FocusNextElement: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.F10],
    shouldHandleEvent: (event, editor) => {
        return (
            editor.isFeatureEnabled(ExperimentalFeatures.TabKeyTextFeatures) &&
            event.rawEvent.altKey &&
            cacheGetEventData(event, FOCUS_NEXT_ELEMENT_KEY, () =>
                editor.getCustomData(FOCUS_NEXT_ELEMENT_KEY)
            )
        );
    },
    handleEvent: (event, editor) => {
        const element = cacheGetEventData(
            event,
            FOCUS_NEXT_ELEMENT_KEY,
            editor.getCustomData(FOCUS_NEXT_ELEMENT_KEY)
        );
        if (safeInstanceOf(element, 'HTMLElement')) {
            element.focus();
        }
    },
    allowFunctionKeys: true,
};

/**
 * @internal
 */
export const TextFeatures: Record<
    keyof TextFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    indentWhenTabText: IndentWhenTabText,
    outdentWhenTabText: OutdentWhenTabText,
    focusNextElement: FocusNextElement,
};

function shouldIndent(editor: IEditor, range: Range): boolean {
    let result: boolean = false;

    const startPosition: NodePosition = Position.getStart(range);
    const endPosition: NodePosition = Position.getEnd(range);
    const firstBlock = editor.getBlockElementAtNode(startPosition.node);
    const lastBlock = editor.getBlockElementAtNode(endPosition.node);

    if (!firstBlock.equals(lastBlock)) {
        //If the selections has more than one block, we indent all the blocks in the selection
        return true;
    } else {
        //We only indent a single block if all the block is selected.
        const blockStart = new Position(firstBlock.getStartNode(), PositionType.Begin);
        const blockEnd = new Position(firstBlock.getEndNode(), PositionType.End);

        const rangeBefore = createRange(blockStart, Position.getStart(range));
        const rangeAfter = createRange(Position.getEnd(range), blockEnd);

        if (!result && isRangeEmpty(rangeBefore) && isRangeEmpty(rangeAfter)) {
            result = true;
        }

        return result;
    }
}

function isRangeEmpty(range: Range) {
    return (
        range.toString() == '' &&
        queryElements(
            range.commonAncestorContainer as ParentNode,
            'img,table,ul,ol',
            null,
            QueryScope.InSelection,
            range
        ).length == 0
    );
}

function insertTab(editor: IEditor, event: PluginKeyboardEvent) {
    const span = editor.getDocument().createElement('span');
    let searcher = editor.getContentSearcherOfCursor(event);
    const charsBefore = searcher.getSubStringBefore(Number.MAX_SAFE_INTEGER);

    const numberOfChars = TAB_SPACES - (charsBefore.length % TAB_SPACES);

    let textContent = '';
    for (let index = 0; index < numberOfChars; index++) {
        textContent += '&ensp;';
    }
    editor.insertNode(span);
    editor.insertContent(textContent, {
        position: ContentPosition.Range,
        range: createRange(span, PositionType.Begin),
        updateCursor: false,
    });
    editor.select(createRange(span, PositionType.After));
}
