import { contains, createRange, getTagOfNode, isBlockElement } from 'roosterjs-editor-dom';
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
    NormalSelectionRange,
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
                    if (isWholeParagraphSelected(editor, selection)) {
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

function isWholeParagraphSelected(editor: IEditor, selection: NormalSelectionRange): boolean {
    const regions = editor.getSelectedRegions();
    let endPosition: NodePosition = null;
    let startPosition: NodePosition = null;
    let isAtStart: boolean = false;
    let isAtEnd: boolean = false;
    let foundStart: boolean;
    let foundEnd: boolean;

    const range = selection.ranges[0];
    let parentBlock: HTMLElement = getCommonBlock(range);

    regions.forEach(r => {
        endPosition = r.fullSelectionEnd;
        startPosition = startPosition || r.fullSelectionStart;
    });

    const parentBlockChildren = Array.from(
        parentBlock.children.length > 0 ? parentBlock.children : parentBlock.childNodes
    );
    const startNode = startPosition.node;
    const endNode = endPosition.node;

    //Iterate the parent block children until we find the end
    for (let index = 0; index < parentBlockChildren.length; index++) {
        const child = parentBlockChildren[index];
        const treatSameNodeAsContain = child.nodeType == Node.TEXT_NODE;

        if (contains(child, startNode, treatSameNodeAsContain)) {
            foundStart = true;
            let tempChild = child.firstChild || child;
            while (tempChild.firstChild) {
                tempChild = tempChild.firstChild ?? null;
            }

            while (isEmptySpan(tempChild)) {
                tempChild = tempChild.nextSibling;
                if (!isEmptySpan(tempChild)) {
                    while (tempChild.firstChild) {
                        tempChild = tempChild.firstChild ?? null;
                    }
                }
            }

            if (tempChild == startNode && startPosition.offset == 0) {
                isAtStart = true;
            }
        }

        if (foundStart && contains(child, endNode, treatSameNodeAsContain)) {
            foundEnd = true;
            let lastChild = child.childNodes[child.childNodes.length - 1] || child;
            while (getTagOfNode(lastChild) == 'BR' && lastChild.previousSibling) {
                lastChild = lastChild.previousSibling;
            }

            if (contains(lastChild, endNode, treatSameNodeAsContain)) {
                let tempChild = lastChild as ChildNode;
                while (tempChild.lastChild) {
                    tempChild = tempChild.lastChild ?? null;
                }

                if (tempChild == endPosition.node && endPosition.isAtEnd) {
                    isAtEnd = true;
                }
            }
        }

        if (foundStart && foundEnd) {
            break;
        }
    }
    return isAtEnd && isAtStart;
}

function getCommonBlock(range: Range) {
    let parentBlock: Node = range.commonAncestorContainer;

    while (!isBlockElement(parentBlock)) {
        parentBlock = parentBlock.parentElement;
    }
    return parentBlock;
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
