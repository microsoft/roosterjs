import {
    VTable,
    setIndentation,
    cacheGetNodeAtCursor,
    cacheGetListTag,
    getNodeAtCursor,
    queryNodesWithSelection,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';
import { Position, getTagOfNode, isNodeEmpty, splitParentNode } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { Indentation, PluginDomEvent, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import ContentEditFeatures, { getDefaultContentEditFeatures } from './ContentEditFeatures';
import tryHandleAutoBullet from './autoBullet';

const KEY_TAB = 9;
const KEY_BACKSPACE = 8;
const KEY_ENTER = 13;
const BLOCKQUOTE_TAG_NAME = 'BLOCKQUOTE';

/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 * 4. Auto bullet/numbering
 */
export default class ContentEdit implements EditorPlugin {
    private editor: Editor;

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private features?: ContentEditFeatures) {
        this.features = this.features || getDefaultContentEditFeatures();
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = null;
    }

    // Handle the event if it is a tab event, and cursor is at begin of a list
    public willHandleEventExclusively(event: PluginEvent): boolean {
        return this.isListEvent(event, [KEY_TAB]) || this.isTabInTable(event);
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent) {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        let blockQuoteElement: Element = null;
        if (this.isListEvent(event, [KEY_TAB, KEY_BACKSPACE, KEY_ENTER])) {
            // Tab: increase indent
            // Shift+ Tab: decrease indent
            if (keyboardEvent.which == KEY_TAB) {
                if (this.features.indentWhenTab && !keyboardEvent.shiftKey) {
                    setIndentation(this.editor, Indentation.Increase);
                    keyboardEvent.preventDefault();
                } else if (this.features.outdentWhenShiftTab && keyboardEvent.shiftKey) {
                    setIndentation(this.editor, Indentation.Decrease);
                    keyboardEvent.preventDefault();
                }
            } else {
                let listElement = cacheGetNodeAtCursor(this.editor, event, 'LI');
                if (listElement && this.shouldToggleState(event, listElement)) {
                    this.toggleList(event);
                } else if (
                    this.features.mergeInNewLineWhenBackspaceOnFirstChar &&
                    keyboardEvent.which == KEY_BACKSPACE &&
                    this.isCursorAtBeginningOf(listElement)
                ) {
                    if (listElement == listElement.parentElement.firstChild) {
                        this.toggleList(event);
                    } else {
                        let document = this.editor.getDocument();
                        document.defaultView.requestAnimationFrame(() => {
                            if (this.editor) {
                                let br = document.createElement('br');
                                this.editor.insertNode(br);
                                this.editor.select(br, Position.After);
                            }
                        });
                    }
                }
            }
        } else if (this.isTabInTable(event)) {
            for (
                let td = this.cacheGetTd(event),
                    vtable = new VTable(td),
                    step = keyboardEvent.shiftKey ? -1 : 1,
                    row = vtable.row,
                    col = vtable.col + step;
                ;
                col += step
            ) {
                if (col < 0 || col >= vtable.cells[row].length) {
                    row += step;
                    if (row < 0 || row >= vtable.cells.length) {
                        this.editor.select(
                            vtable.table,
                            keyboardEvent.shiftKey ? Position.Before : Position.After
                        );
                        break;
                    }
                    col = keyboardEvent.shiftKey ? vtable.cells[row].length - 1 : 0;
                }
                let cell = vtable.getCell(row, col);
                if (cell.td) {
                    this.editor.select(cell.td, Position.Begin);
                    break;
                }
            }
            keyboardEvent.preventDefault();
        } else if ((blockQuoteElement = this.getBlockQuoteElementFromEvent(event, keyboardEvent))) {
            let node = getNodeAtCursor(this.editor);
            if (node && node != blockQuoteElement) {
                while (this.editor.contains(node) && node.parentNode != blockQuoteElement) {
                    node = node.parentNode;
                }
                if (node.parentNode == blockQuoteElement && this.shouldToggleState(event, node)) {
                    keyboardEvent.preventDefault();
                    this.editor.formatWithUndo(() => {
                        splitParentNode(node, false /*splitBefore*/);

                        blockQuoteElement.parentNode.insertBefore(
                            node,
                            blockQuoteElement.nextSibling
                        );
                        if (!blockQuoteElement.firstChild) {
                            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
                        }

                        this.editor.select(node, Position.Before);
                    });
                }
            }
        } else if (
            this.features.autoBullet &&
            tryHandleAutoBullet(this.editor, event, keyboardEvent)
        ) {
            keyboardEvent.preventDefault();
        }
    }

    // Check if it is a tab or shift+tab / Enter / Backspace event
    // This tests following:
    // 1) is keydown
    // 2) is Tab / Enter / Backspace
    // 3) any of ctrl/meta/alt is not pressed
    private isListEvent(event: PluginEvent, interestedKeyCodes: number[]) {
        if (event.eventType == PluginEventType.KeyDown) {
            let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
            if (
                interestedKeyCodes.indexOf(keyboardEvent.which) >= 0 &&
                !keyboardEvent.ctrlKey &&
                !keyboardEvent.altKey &&
                !keyboardEvent.metaKey
            ) {
                // Checks if cursor on a list
                let tag = cacheGetListTag(this.editor, event);
                if (tag == 'UL' || tag == 'OL') {
                    return true;
                }
            }
        }

        return false;
    }

    private isTabInTable(event: PluginEvent): boolean {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        return (
            this.features.tabInTable &&
            event.eventType == PluginEventType.KeyDown &&
            keyboardEvent.which == KEY_TAB &&
            !!this.cacheGetTd(event)
        );
    }

    private cacheGetTd(event: PluginEvent): HTMLTableCellElement {
        return cacheGetNodeAtCursor(this.editor, event, 'TD') as HTMLTableCellElement;
    }

    // Check if it is a blockquote event, if it is true, return the blockquote element where the cursor resides
    // To qualify a blockquote event:
    // 1. Cursor is in blockquote element
    // 2. Current block has no content
    // 3. is keyDown
    // 4. is Enter or Backspace
    // 5. Any of ctrl/meta/alt is not pressed
    private getBlockQuoteElementFromEvent(
        event: PluginEvent,
        keyboardEvent: KeyboardEvent
    ): Element {
        return event.eventType == PluginEventType.KeyDown &&
            (keyboardEvent.which == KEY_BACKSPACE || keyboardEvent.which == KEY_ENTER) &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey
            ? queryNodesWithSelection<Element>(this.editor, BLOCKQUOTE_TAG_NAME)[0]
            : null;
    }

    private shouldToggleState(event: PluginEvent, node: Node) {
        let isEmpty = isNodeEmpty(node);
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        let isList = getTagOfNode(node) == 'LI';

        if (
            ((isList && this.features.outdentWhenBackspaceOnEmptyFirstLine) ||
                (!isList && this.features.unquoteWhenBackspaceOnEmptyFirstLine)) &&
            isEmpty &&
            keyboardEvent.which == KEY_BACKSPACE &&
            node == node.parentNode.firstChild
        ) {
            return true;
        }

        if (
            ((isList && this.features.outdentWhenEnterOnEmptyLine) ||
                (!isList && this.features.unquoteWhenEnterOnEmptyLine)) &&
            isEmpty &&
            keyboardEvent.which == KEY_ENTER
        ) {
            return true;
        }

        return false;
    }

    private toggleList(event: PluginEvent) {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        let tag = cacheGetListTag(this.editor, event);

        keyboardEvent.preventDefault();
        if (tag == 'UL') {
            toggleBullet(this.editor);
        } else if (tag == 'OL') {
            toggleNumbering(this.editor);
        }
    }

    private isCursorAtBeginningOf(node: Node) {
        let range = this.editor.getSelectionRange();
        return (
            range.collapsed &&
            range.start.offset == 0 &&
            new Position(node, 0).normalize().equalTo(range.start.normalize())
        );
    }
}
