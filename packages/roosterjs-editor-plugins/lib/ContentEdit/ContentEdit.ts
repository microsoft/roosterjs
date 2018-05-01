import {
    cacheGetCursorEventData,
    setIndentation,
    cacheGetNodeAtCursor,
    cacheGetListState,
    execFormatWithUndo,
    getNodeAtCursor,
    queryNodesWithSelection,
    toggleBullet,
    toggleNumbering,
    validateAndGetRangeForTextBeforeCursor,
} from 'roosterjs-editor-api';
import { VTable, contains, getTagOfNode, isNodeEmpty, splitParentNode } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';
import {
    ChangeSource,
    Indentation,
    ListState,
    NodeBoundary,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import ContentEditFeatures, { getDefaultContentEditFeatures } from './ContentEditFeatures';

const KEY_TAB = 9;
const KEY_BACKSPACE = 8;
const KEY_ENTER = 13;
const KEY_SPACE = 32;
const BLOCKQUOTE_TAG_NAME = 'BLOCKQUOTE';

/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 */
export default class ContentEdit implements EditorPlugin {
    private editor: Editor;
    private backspaceToUndo: boolean;

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private features?: ContentEditFeatures) {
        this.features = this.features || getDefaultContentEditFeatures();
    }

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public dispose(): void {
        this.editor = null;
    }

    // Handle the event if it is a tab event, and cursor is at begin of a list
    public willHandleEventExclusively(event: PluginEvent): boolean {
        return this.isListEvent(event, [KEY_TAB]) || this.isTabInTable(event);
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        let blockQuoteElement: Element = null;
        if (
            this.backspaceToUndo &&
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.MouseDown ||
                event.eventType == PluginEventType.ContentChanged)
        ) {
            this.backspaceToUndo = false;
            if (
                event.eventType == PluginEventType.KeyDown &&
                keyboardEvent.which == KEY_BACKSPACE
            ) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        }

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
                                let range = document.createRange();
                                range.setStartAfter(br);
                                this.editor.updateSelection(range);
                            }
                        });
                    }
                }
            }
        } else if (this.isTabInTable(event)) {
            let range = this.editor.getDocument().createRange();
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
                        if (keyboardEvent.shiftKey) {
                            range.setStartBefore(vtable.table);
                        } else {
                            range.setEndAfter(vtable.table);
                            range.collapse(false /*toStart*/);
                        }
                        this.editor.updateSelection(range);
                        break;
                    }
                    col = keyboardEvent.shiftKey ? vtable.cells[row].length - 1 : 0;
                }
                let cell = vtable.getCell(row, col);
                if (cell.td) {
                    range.setStart(cell.td, 0);
                    this.editor.updateSelection(range);
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
                    execFormatWithUndo(this.editor, () => {
                        splitParentNode(node, false /*splitBefore*/);

                        blockQuoteElement.parentNode.insertBefore(
                            node,
                            blockQuoteElement.nextSibling
                        );
                        if (!blockQuoteElement.firstChild) {
                            blockQuoteElement.parentNode.removeChild(blockQuoteElement);
                        }

                        let range = this.editor.getSelectionRange();
                        range.selectNode(node);
                        range.collapse(true /*toStart*/);
                        this.editor.updateSelection(range);
                    });
                }
            }
        } else if (
            this.features.autoBullet &&
            event.eventType == PluginEventType.KeyDown &&
            keyboardEvent.which == KEY_SPACE &&
            cacheGetListState(this.editor, event) == ListState.None &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey
        ) {
            this.handleAutoBullet(event);
        }
    }

    private handleAutoBullet(event: PluginEvent) {
        let cursorData = cacheGetCursorEventData(event, this.editor);

        // We pick 3 characters before cursor so that if any characters exist before "1." or "*",
        // we do not fire auto list.
        let textBeforeCursor = cursorData.getXCharsBeforeCursor(3);

        // Auto list is triggered if:
        // 1. Text before cursor exactly mathces '*', '-' or '1.'
        // 2. There's no non-text inline entities before cursor
        if (
            ['*', '-', '1.'].indexOf(textBeforeCursor) >= 0 &&
            !cursorData.getFirstNonTextInlineBeforeCursor()
        ) {
            this.editor.runAsync(() => {
                let listNode: Node;

                // editor.insertContent(NBSP);
                this.editor.addUndoSnapshot();
                this.editor.runWithoutAddingUndoSnapshot(() => {
                    // Remove the user input '*', '-' or '1.'
                    let rangeToDelete = validateAndGetRangeForTextBeforeCursor(
                        this.editor,
                        textBeforeCursor + '\u00A0', // Add the &nbsp; we just inputted
                        true /*exactMatch*/,
                        cursorData
                    );
                    if (rangeToDelete) {
                        rangeToDelete.deleteContents();
                    }

                    // If not explicitly insert br, Chrome will operate on the previous line
                    if (browserData.isChrome || browserData.isSafari) {
                        this.editor.insertContent('<BR>');
                    }

                    if (textBeforeCursor == '1.') {
                        toggleNumbering(this.editor);
                        listNode = getNodeAtCursor(this.editor, 'OL');
                    } else {
                        toggleBullet(this.editor);
                        listNode = getNodeAtCursor(this.editor, 'UL');
                    }
                });

                this.editor.addUndoSnapshot();

                if (listNode) {
                    this.editor.triggerContentChangedEvent(ChangeSource.AutoBullet, listNode);
                    this.backspaceToUndo = true;
                }
            });
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
                let listState = cacheGetListState(this.editor, event);
                if (
                    listState &&
                    (listState == ListState.Bullets || listState == ListState.Numbering)
                ) {
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
        return cacheGetNodeAtCursor(this.editor, event, ['TD', 'TH']) as HTMLTableCellElement;
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
        if (event.eventType == PluginEventType.KeyDown) {
            if (
                (keyboardEvent.which == KEY_BACKSPACE || keyboardEvent.which == KEY_ENTER) &&
                !keyboardEvent.ctrlKey &&
                !keyboardEvent.altKey &&
                !keyboardEvent.metaKey
            ) {
                return queryNodesWithSelection(this.editor, BLOCKQUOTE_TAG_NAME)[0] as Element;
            }
        }

        return null;
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
        let listState = cacheGetListState(this.editor, event);

        keyboardEvent.preventDefault();
        if (listState == ListState.Bullets) {
            toggleBullet(this.editor);
        } else if (listState == ListState.Numbering) {
            toggleNumbering(this.editor);
        }
    }

    private isCursorAtBeginningOf(node: Node) {
        let range = this.editor.getSelectionRange();
        if (range && range.startOffset == NodeBoundary.Begin) {
            let container = range.startContainer;
            while (container != node && contains(node, container) && !container.previousSibling) {
                container = container.parentNode;
            }
            return container == node;
        }
        return false;
    }
}
