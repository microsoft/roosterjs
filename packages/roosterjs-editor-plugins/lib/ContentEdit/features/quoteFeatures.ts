import { ContentEditFeature } from '../ContentEditFeatures';
import { Editor, cacheGetEventData } from 'roosterjs-editor-core';
import { PluginDomEvent, PositionType } from 'roosterjs-editor-types';
import { getTagOfNode, isNodeEmpty, splitParentNode } from 'roosterjs-editor-dom';
import { getNodeAtCursor } from 'roosterjs-editor-api';

const KEY_BACKSPACE = 8;
const KEY_ENTER = 13;
const QUOTE_TAG = 'BLOCKQUOTE';

export const UnquoteWhenBackOnEmpty1stLine: ContentEditFeature = {
    keys: [KEY_BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
};

export const UnquoteWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [KEY_ENTER],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: (event, editor) => editor.performAutoComplete(() => splitQuote(event, editor)),
};

function cacheGetQuoteChild(event: PluginDomEvent, editor: Editor): Node {
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

function splitQuote(event: PluginDomEvent, editor: Editor) {
    editor.addUndoSnapshot(() => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let blockQuoteElement = childOfQuote.parentNode;
        splitParentNode(childOfQuote, false /*splitBefore*/);

        blockQuoteElement.parentNode.insertBefore(childOfQuote, blockQuoteElement.nextSibling);
        if (!blockQuoteElement.firstChild) {
            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
        }

        editor.select(childOfQuote, PositionType.Begin);
    });
    event.rawEvent.preventDefault();
}
