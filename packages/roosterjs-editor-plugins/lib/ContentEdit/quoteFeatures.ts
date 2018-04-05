import { ContentEditFeature } from './ContentEditFeatures';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginDomEvent } from 'roosterjs-editor-types';
import { Position, getTagOfNode, isNodeEmpty, splitParentNode } from 'roosterjs-editor-dom';
import { getNodeAtCursor } from 'roosterjs-editor-api';

const KEY_BACKSPACE = 8;
const KEY_ENTER = 13;

export const UnquoteBSEmptyLine1: ContentEditFeature = {
    key: KEY_BACKSPACE,
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
};

export const UnquoteWhenEnterOnEmptyLine: ContentEditFeature = {
    key: KEY_ENTER,
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: splitQuote,
};

function cacheGetQuoteChild(event: PluginDomEvent, editor: Editor): Node {
    return cacheGetEventData(event, 'QUOTE_CHILD', () => {
        let node = getNodeAtCursor(editor);
        while (editor.contains(node) && getTagOfNode(node.parentNode) != 'BLOCKQUOTE') {
            node = node.parentNode;
        }
        return getTagOfNode(node.parentNode) == 'BLOCKQUOTE' ? node : null;
    });
}

function splitQuote(event: PluginDomEvent, editor: Editor) {
    editor.formatWithUndo(() => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let blockQuoteElement = childOfQuote.parentNode;
        splitParentNode(childOfQuote, false /*splitBefore*/);

        blockQuoteElement.parentNode.insertBefore(childOfQuote, blockQuoteElement.nextSibling);
        if (!blockQuoteElement.firstChild) {
            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
        }

        editor.select(childOfQuote, Position.Begin);
    });
    event.rawEvent.preventDefault();
}
