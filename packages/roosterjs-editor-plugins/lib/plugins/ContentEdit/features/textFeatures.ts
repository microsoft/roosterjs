import { createRange, getTagOfNode, Position, queryElements } from 'roosterjs-editor-dom';
import { setIndentation } from 'roosterjs-editor-api';
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
                    if (shouldSetIndentation(editor, range)) {
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
        if (
            event.rawEvent.shiftKey &&
            editor.isFeatureEnabled(ExperimentalFeatures.TabKeyTextFeatures)
        ) {
            const selection = editor.getSelectionRangeEx();

            return (
                selection.type == SelectionRangeTypes.Normal &&
                !selection.areAllCollapsed &&
                editor.getElementAtCursor('blockquote', null, event) &&
                !editor.getElementAtCursor('LI,TABLE', null /*startFrom*/, event) &&
                shouldSetIndentation(editor, selection.ranges[0])
            );
        }

        return false;
    },
    handleEvent: (event, editor) => {
        editor.addUndoSnapshot(() => setIndentation(editor, Indentation.Decrease));

        event.rawEvent.preventDefault();
    },
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
};

function shouldSetIndentation(editor: IEditor, range: Range): boolean {
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
    let span2: HTMLSpanElement;

    let textContent = '';
    for (let index = 0; index < numberOfChars; index++) {
        textContent += '&ensp;';
    }
    editor.insertNode(span);
    if (span.nextElementSibling && getTagOfNode(span.nextElementSibling) == 'A') {
        span2 = editor.getDocument().createElement('span');
        span2.textContent = ' ';
        editor.insertNode(span2);
        editor.select(createRange(span2, PositionType.Before));
    }
    editor.insertContent(textContent, {
        position: ContentPosition.Range,
        range: createRange(span, PositionType.Begin),
        updateCursor: false,
    });
    editor.select(createRange(span, PositionType.After));
    if (span2) {
        editor.deleteNode(span2);
    }
}
