import { createRange, Position } from 'roosterjs-editor-dom';
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
} from 'roosterjs-editor-types';

/**
 * Requires @see ExperimentalFeatures.TabKeyTextFeatures to be enabled
 * Provides additional functionality when press Tab:
 *      If Whole Paragraph selected, indent paragraph,
 *      If range is collapsed, add tab spaces
 *      If range is not collapsed but not all the paragraph is selected, replace selection with Tab spaces
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
                    if (isWholeParagraphSelected(editor, range)) {
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
 * @internal
 */
export const TextFeatures: Record<
    keyof TextFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    indentWhenTabText: IndentWhenTabText,
};

function isWholeParagraphSelected(editor: IEditor, range: Range): boolean {
    const endPosition: NodePosition = Position.getEnd(range);
    const startPosition: NodePosition = Position.getStart(range);

    const isAtStart: boolean = checkIfIsAtBlockLimit(editor, startPosition, true /* start */);
    const isAtEnd: boolean = checkIfIsAtBlockLimit(editor, endPosition, false /* start */);

    return isAtEnd && isAtStart;
}

/**
 * Checks whether the position provided is at the start or at the end of the block element that contains the position.
 * @param editor Editor Instance
 * @param pos Position to check if is at the limits of the block
 * @param start If true, checks from the beginning of the block, if false check from the end of block
 * @returns boolean. true if is at limit, false otherwise
 */
function checkIfIsAtBlockLimit(editor: IEditor, pos: NodePosition, start: boolean): boolean {
    let isAtLimit: boolean;
    let blockElement = editor.getBlockElementAtNode(pos.node).getEndNode();
    const block = start ? blockElement.firstChild : blockElement.lastChild || blockElement;

    const tempChild = ignoreEmptyElement(block, start);

    if (tempChild == pos.node && start ? pos.offset == 0 : pos.isAtEnd) {
        isAtLimit = true;
    }
    return isAtLimit;
}

/**
 * Ignore unselectable empty elements at start or end of the block
 * @param block Block to check
 * @param start if true, will check from the begin of the block, else will check the end of the block
 * @returns Last node at the end or start
 */
function ignoreEmptyElement(block: Node | ChildNode, start: boolean): Node | ChildNode {
    const getNextElement = (node: Node, block: Node | ChildNode) =>
        start
            ? node.nextSibling || block.nextSibling
            : node.previousSibling || block.previousSibling;
    const getElementToCheck = (node: Node) => (start ? node.firstChild : node.lastChild);

    let tempChild = block;
    while (getElementToCheck(tempChild)) {
        tempChild = getElementToCheck(tempChild);
    }

    while (isEmptyElement(tempChild)) {
        tempChild = getNextElement(tempChild, block);
        if (!isEmptyElement(tempChild)) {
            block = tempChild;
            return ignoreEmptyElement(block, start);
        }
    }
    return tempChild;
}

function isEmptyElement(tempChild: Node | ChildNode) {
    const range = createRange(tempChild, PositionType.Begin, tempChild, PositionType.End);
    return range.collapsed;
}

function insertTab(editor: IEditor, event: PluginKeyboardEvent) {
    const span = editor.getDocument().createElement('span');
    let searcher = editor.getContentSearcherOfCursor(event);
    const charsBefore = searcher.getSubStringBefore(Number.MAX_SAFE_INTEGER);

    const numberOfChars = 6 - (charsBefore.length % 6);

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
