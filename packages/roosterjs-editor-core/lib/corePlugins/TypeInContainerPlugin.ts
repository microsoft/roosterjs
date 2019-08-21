import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import {
    applyFormat,
    Browser,
    findClosestElementAncestor,
    fromHtml,
    isNodeEmpty,
    Position,
} from 'roosterjs-editor-dom';
import {
    ContentPosition,
    NodePosition,
    PluginKeyboardEvent,
    PositionType,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * Typing Component helps to ensure typing is always happening under a DOM container
 */
export default class TypeInContainerPlugin implements EditorPlugin {
    private editor: Editor;

    getName() {
        return 'TypeInContainer';
    }

    initialize(editor: Editor) {
        this.editor = editor;
    }

    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyPress) {
            this.onKeyPress(event);
        }
    }

    /**
     * Ensure we are typing in an HTML Element inside editor, and apply default format if current block is empty
     * @param node Current node
     * @param event (optional) The keyboard event that we are ensuring is typing in an element.
     * @returns A new position to select
     */
    ensureTypeInElement(position: NodePosition, event?: PluginKeyboardEvent): NodePosition {
        let result = position.normalize();
        let block = this.editor.getBlockElementAtNode(result.node);
        let formatNode: HTMLElement;

        if (block) {
            formatNode = block.collapseToSingleElement();

            // if the block is empty, apply default format
            // Otherwise, leave it as it is as we don't want to change the style for existing data
            // unless the block was just created by the keyboard event (e.g. ctrl+a & start typing)
            const shouldSetNodeStyles =
                isNodeEmpty(formatNode) ||
                (event && this.wasNodeJustCreatedByKeyboardEvent(event, formatNode));
            formatNode = formatNode && shouldSetNodeStyles ? formatNode : null;
        } else {
            // Only reason we don't get the selection block is that we have an empty content div
            // which can happen when users removes everything (i.e. select all and DEL, or backspace from very end to begin)
            // The fix is to add a DIV wrapping, apply default format and move cursor over
            formatNode = fromHtml(
                Browser.isEdge ? '<div><span><br></span></div>' : '<div><br></div>',
                this.editor.getDocument()
            )[0] as HTMLElement;
            this.editor.insertNode(formatNode, {
                position: ContentPosition.End,
                updateCursor: false,
                replaceSelection: false,
                insertOnNewLine: false,
            });

            // element points to a wrapping node we added "<div><br></div>". We should move the selection left to <br>
            result = new Position(formatNode.firstChild, PositionType.Begin);
        }

        if (formatNode) {
            applyFormat(formatNode, this.editor.getDefaultFormat(), this.editor.isDarkMode());
        }

        return result;
    }

    private onKeyPress(event: PluginKeyboardEvent) {
        // If normalization was not possible before the keypress,
        // check again after the keyboard event has been processed by browser native behaviour.
        //
        // This handles the case where the keyboard event that first inserts content happens when
        // there is already content under the selection (e.g. Ctrl+a -> type new content).
        //
        // Only scheudle when the range is not collapsed to catch this edge case.
        let range = this.editor.getSelectionRange();

        if (!range || this.editor.contains(findClosestElementAncestor(range.startContainer))) {
            return;
        }

        if (range.collapsed) {
            this.tryNormalizeTyping(event, range);
        } else if (!range.collapsed) {
            this.editor.runAsync(() => {
                this.tryNormalizeTyping(event);
            });
        }
    }

    /**
     * When typing goes directly under content div, many things can go wrong
     * We fix it by wrapping it with a div and reposition cursor within the div
     */
    private tryNormalizeTyping(event: PluginKeyboardEvent, range?: Range) {
        let position = this.ensureTypeInElement(
            Position.getStart(range || this.editor.getSelectionRange()),
            event
        );
        this.editor.select(position);
    }

    private wasNodeJustCreatedByKeyboardEvent(event: PluginKeyboardEvent, formatNode: HTMLElement) {
        return (
            event.rawEvent.target instanceof Node &&
            event.rawEvent.target.contains(formatNode) &&
            event.rawEvent.key === formatNode.innerText
        );
    }
}
