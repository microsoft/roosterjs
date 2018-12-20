import { cacheGetEventData, Editor } from 'roosterjs-editor-core';
import { ContentEditFeature, Keys } from '../ContentEditFeatures';
import {
    getTagOfNode,
    isNodeEmpty,
    splitBalancedNodeRange,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';
import { PluginKeyboardEvent, PositionType } from 'roosterjs-editor-types';

const QUOTE_TAG = 'BLOCKQUOTE';
const STRUCTURED_TAGS = [QUOTE_TAG, 'LI', 'TD', 'TH'].join(',');

export const UnquoteWhenBackOnEmpty1stLine: ContentEditFeature = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
    featureFlag: 'unquoteWhenBackspaceOnEmptyFirstLine',
};

export const UnquoteWhenEnterOnEmptyLine: ContentEditFeature = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let shift = event.rawEvent.shiftKey;
        return !shift && childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: (event, editor) => editor.performAutoComplete(() => splitQuote(event, editor)),
    featureFlag: 'unquoteWhenEnterOnEmptyLine',
};

function cacheGetQuoteChild(event: PluginKeyboardEvent, editor: Editor): Node {
    return cacheGetEventData(event, 'QUOTE_CHILD', () => {
        let quote = editor.getElementAtCursor(STRUCTURED_TAGS);
        if (quote && getTagOfNode(quote) == QUOTE_TAG) {
            let pos = editor.getFocusedPosition();
            let block = pos && editor.getBlockElementAtNode(pos.normalize().node);
            if (block) {
                let node =
                    block.getStartNode() == quote
                        ? block.getStartNode()
                        : block.collapseToSingleElement();
                return isNodeEmpty(node) ? node : null;
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
