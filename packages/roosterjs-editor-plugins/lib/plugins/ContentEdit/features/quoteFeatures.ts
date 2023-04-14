import { clearFormat } from 'roosterjs-editor-api';
import {
    BuildInEditFeature,
    IEditor,
    Keys,
    PluginKeyboardEvent,
    PositionType,
    QuoteFeatureSettings,
} from 'roosterjs-editor-types';
import {
    cacheGetEventData,
    getTagOfNode,
    isNodeEmpty,
    safeInstanceOf,
    splitBalancedNodeRange,
    toArray,
    unwrap,
    wrap,
} from 'roosterjs-editor-dom';

const QUOTE_TAG = 'BLOCKQUOTE';
const STRUCTURED_TAGS = [QUOTE_TAG, 'LI', 'TD', 'TH'].join(',');

/**
 * UnquoteWhenBackOnEmpty1stLine edit feature, provides the ability to Unquote current line when
 * user press BACKSPACE on first and empty line of a BLOCKQUOTE
 */
const UnquoteWhenBackOnEmpty1stLine: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.BACKSPACE],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        return childOfQuote && isNodeEmpty(childOfQuote) && !childOfQuote.previousSibling;
    },
    handleEvent: splitQuote,
};

/**
 * UnquoteWhenEnterOnEmptyLine edit feature, provides the ability to Unquote current line when
 * user press ENTER on an empty line of a BLOCKQUOTE
 */
const UnquoteWhenEnterOnEmptyLine: BuildInEditFeature<PluginKeyboardEvent> = {
    keys: [Keys.ENTER],
    shouldHandleEvent: (event, editor) => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        let shift = event.rawEvent.shiftKey;
        return !shift && childOfQuote && isNodeEmpty(childOfQuote);
    },
    handleEvent: (event, editor) =>
        editor.addUndoSnapshot(
            () => splitQuote(event, editor),
            undefined /*changeSource*/,
            true /*canUndoByBackspace*/
        ),
};

function cacheGetQuoteChild(event: PluginKeyboardEvent, editor: IEditor): Node | null {
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

function splitQuote(event: PluginKeyboardEvent, editor: IEditor) {
    editor.addUndoSnapshot(() => {
        let childOfQuote = cacheGetQuoteChild(event, editor);
        if (!childOfQuote) {
            return;
        }
        if (getTagOfNode(childOfQuote) == QUOTE_TAG) {
            childOfQuote = wrap(toArray(childOfQuote.childNodes));
        }
        const parent = splitBalancedNodeRange(childOfQuote);
        const shouldClearFormat = !!parent && isStyledBlockquote(parent);
        const newParent = parent && unwrap(parent);
        editor.select(childOfQuote, PositionType.Begin);

        if (shouldClearFormat) {
            if (safeInstanceOf(newParent, 'HTMLLIElement')) {
                newParent.style.removeProperty('color');
            }
            clearFormat(editor);
        }
    });
    event.rawEvent.preventDefault();
}

const isStyledBlockquote = (element: Node) => {
    if (
        element &&
        safeInstanceOf(element, 'HTMLQuoteElement') &&
        element.style.borderLeft &&
        element.style.borderColor &&
        element.style.paddingLeft &&
        element.style.color
    ) {
        return true;
    }
    return false;
};

/**
 * @internal
 */
export const QuoteFeatures: Record<
    keyof QuoteFeatureSettings,
    BuildInEditFeature<PluginKeyboardEvent>
> = {
    unquoteWhenBackspaceOnEmptyFirstLine: UnquoteWhenBackOnEmpty1stLine,
    unquoteWhenEnterOnEmptyLine: UnquoteWhenEnterOnEmptyLine,
};
