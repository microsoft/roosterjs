import { ContentEditFeature, Keys } from '../ContentEditFeatures';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';
import { getTagOfNode, isNodeEmpty, splitBalancedNodeRange, unwrap } from 'roosterjs-editor-dom';
import { getNodeAtCursor } from 'roosterjs-editor-api';

const QUOTE_TAG = 'BLOCKQUOTE';

export const UnquoteWhenBackOnEmpty1stLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
    isAvailable: featureSet => featureSet.unquoteWhenBackspaceOnEmptyFirstLine,
};

export const UnquoteWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let shift = event.rawEvent.shiftKey;
        return !shift && childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: (event, editor) => editor.performAutoComplete(() => splitQuote(event, editor)),
    isAvailable: featureSet => featureSet.unquoteWhenEnterOnEmptyLine,
};

function cacheGetQuoteChild(event: PluginKeyboardEvent, editor: Editor): Node {
    return cacheGetEventData(event, 'QUOTE_CHILD', () => {
        let node = getNodeAtCursor(editor);
        if (getTagOfNode(node) == QUOTE_TAG) {
            return node.firstChild;
        }
        while (editor.contains(node) && getTagOfNode(node.parentNode) != QUOTE_TAG) {
            node = node.parentNode;
        }
        return node && getTagOfNode(node.parentNode) == QUOTE_TAG ? node : null;
    });
}

function splitQuote(event: PluginKeyboardEvent, editor: Editor) {
    editor.addUndoSnapshot(() => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let parent = splitBalancedNodeRange(childOfQuote);
        unwrap(parent);
        editor.select(childOfQuote, PositionType.Begin);
    });
    event.rawEvent.preventDefault();
}
