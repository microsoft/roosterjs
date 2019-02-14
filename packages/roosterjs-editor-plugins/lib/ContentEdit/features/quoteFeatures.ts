import shouldInsertLineBefore from './shouldInsertLineBefore';
import { cacheGetEventData, ContentEditFeature, Editor, Keys } from 'roosterjs-editor-core';
import { PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';
import {
    createNewLineNode,
    getTagOfNode,
    isNodeEmpty,
    splitBalancedNodeRange,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

const QUOTE_TAG = 'BLOCKQUOTE';
const STRUCTURED_TAGS = [QUOTE_TAG, 'LI', 'TD', 'TH'].join(',');

export const UnquoteWhenBackOnEmpty1stLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
};

export const UnquoteWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let shift = event.rawEvent.shiftKey;
        return !shift && childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: (event, editor) => editor.performAutoComplete(() => splitQuote(event, editor)),
};

export const EnterInFirstQuoteLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: getQuoteForFirstLineOfStartingQuote,
    handleEvent: (event, editor) => {
        let quote = getQuoteForFirstLineOfStartingQuote(event, editor);
        let div = createNewLineNode(editor.getDocument());
        editor.addUndoSnapshot(() => {
            quote.parentNode.insertBefore(div, quote);
        });
        event.rawEvent.preventDefault();
    },
};

function cacheGetQuoteChild(event: PluginKeyboardEvent, editor: Editor): Node {
    return cacheGetEventData(event, 'QUOTE_CHILD', () => {
        let quote = editor.getElementAtCursor(STRUCTURED_TAGS);
        if (quote && getTagOfNode(quote) == QUOTE_TAG) {
            let pos = editor.getFocusedPosition();
            let block = pos && editor.getBlockElementAtNode(pos.normalize().node);
            if (block) {
                return block.getStartNode() == quote
                    ? block.getStartNode()
                    : block.collapseToSingleElement();
            }
        }

        return null;
    });
}

function splitQuote(event: PluginKeyboardEvent, editor: Editor) {
    editor.addUndoSnapshot(() => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let parent: Node;
        if (getTagOfNode(childOfQuote) == QUOTE_TAG) {
            childOfQuote = wrap([].slice.call(childOfQuote.childNodes));
        }
        parent = splitBalancedNodeRange(childOfQuote);
        unwrap(parent);
        editor.select(childOfQuote, PositionType.Begin);
    });
    event.rawEvent.preventDefault();
}

function getQuoteForFirstLineOfStartingQuote(
    event: PluginKeyboardEvent,
    editor: Editor
): HTMLElement {
    return cacheGetEventData(event, 'QUOTE_FOR_FIRST_LINE', () => {
        // Provide a chance to keep browser default behavior by pressing SHIFT
        let quoteChild = event.rawEvent.shiftKey ? null : cacheGetQuoteChild(event, editor);

        return (
            quoteChild &&
            shouldInsertLineBefore(editor, quoteChild) &&
            editor.getElementAtCursor(QUOTE_TAG, quoteChild)
        );
    });
}
