import { createRange, getTagOfNode } from 'roosterjs-editor-dom';
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
                    if (isWholeParagraphSelected(editor)) {
                        setIndentation(editor, Indentation.Increase);
                    } else {
                        const { ranges } = selection;
                        const range = ranges[0];
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

function isWholeParagraphSelected(editor: IEditor): boolean {
    const regions = editor.getSelectedRegions();
    let endPosition: NodePosition = null;
    let startPosition: NodePosition = null;

    regions.forEach(r => {
        endPosition = r.fullSelectionEnd;
        startPosition = startPosition || r.fullSelectionStart;
    });

    const isAtStart: boolean = checkIfIsAtStart(editor, startPosition, startPosition.node);
    const isAtEnd: boolean = checkIfIsAtEnd(editor, endPosition, endPosition.node);

    return isAtEnd && isAtStart;
}

function checkIfIsAtEnd(editor: IEditor, endPosition: NodePosition, endNode: Node): boolean {
    let isAtEnd: boolean;
    let blockElement = editor.getBlockElementAtNode(endPosition.node).collapseToSingleElement();

    let tempChild = blockElement as ChildNode;
    while (tempChild.lastChild) {
        tempChild = tempChild.lastChild ?? null;
    }

    if (tempChild == endPosition.node && endPosition.isAtEnd) {
        isAtEnd = true;
    }
    return isAtEnd;
}

function checkIfIsAtStart(editor: IEditor, startPosition: NodePosition, startNode: Node): boolean {
    let isAtStart: boolean;
    const blockElement = editor.getBlockElementAtNode(startPosition.node).collapseToSingleElement();
    let tempChild = blockElement.firstChild || blockElement;
    while (tempChild.firstChild) {
        tempChild = tempChild.firstChild ?? null;
    }

    tempChild = ignoreEmptySpans(tempChild);

    if (tempChild == startNode && startPosition.offset == 0) {
        isAtStart = true;
    }
    return isAtStart;
}

function ignoreEmptySpans(tempChild: ChildNode) {
    while (isEmptySpan(tempChild)) {
        tempChild = tempChild.nextSibling;
        if (!isEmptySpan(tempChild)) {
            while (tempChild.firstChild) {
                tempChild = tempChild.firstChild;
                ignoreEmptySpans(tempChild);
            }
        }
    }
    return tempChild;
}

function isEmptySpan(tempChild: ChildNode) {
    return (
        getTagOfNode(tempChild) == 'SPAN' &&
        (!tempChild.firstChild ||
            (getTagOfNode(tempChild.firstChild) == 'BR' && !tempChild.firstChild.nextSibling))
    );
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
