import {
    setIndentation,
    cacheGetListElement,
    cacheGetListState,
    execFormatWithUndo,
    getNodeAtCursor,
    queryNodesWithSelection,
    toggleBullet,
    toggleNumbering,
} from 'roosterjs-editor-api';
import { isNodeEmpty, splitParentNode } from 'roosterjs-editor-dom';
import { Editor, EditorPlugin, browserData } from 'roosterjs-editor-core';
import {
    Indentation,
    ListState,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

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
 */
export default class ContentEdit implements EditorPlugin {
    private editor: Editor;

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public dispose(): void {
        this.editor = null;
    }

    // Handle the event if it is a tab event, and cursor is at begin of a list
    public willHandleEventExclusively(event: PluginEvent): boolean {
        return this.isListEvent(event, [KEY_TAB]);
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        if (this.isListEvent(event, [KEY_TAB, KEY_BACKSPACE, KEY_ENTER])) {
            // Tab: increase indent
            // Shift+ Tab: decrease indent
            if (keyboardEvent.which == KEY_TAB) {
                setIndentation(
                    this.editor,
                    keyboardEvent.shiftKey ? Indentation.Decrease : Indentation.Increase
                );
                keyboardEvent.preventDefault();
            } else if (browserData.isEdge || browserData.isIE || browserData.isChrome) {
                let listElement = cacheGetListElement(this.editor, event);
                if (listElement && this.shouldToggleState(keyboardEvent, listElement)) {
                    keyboardEvent.preventDefault();
                    let listState = cacheGetListState(this.editor, event);
                    if (listState == ListState.Bullets) {
                        toggleBullet(this.editor);
                    } else if (listState == ListState.Numbering) {
                        toggleNumbering(this.editor);
                    }
                }
            }
        } else {
            let blockQuoteElement = this.getBlockQuoteElementFromEvent(event, keyboardEvent);
            if (blockQuoteElement) {
                let node = getNodeAtCursor(this.editor);
                if (node && node != blockQuoteElement) {
                    while (this.editor.contains(node) && node.parentNode != blockQuoteElement) {
                        node = node.parentNode;
                    }
                    if (
                        node.parentNode == blockQuoteElement &&
                        this.shouldToggleState(keyboardEvent, node)
                    ) {
                        keyboardEvent.preventDefault();
                        execFormatWithUndo(this.editor, () => {
                            splitParentNode(node, false /*splitBefore*/);

                            blockQuoteElement.parentNode.insertBefore(node, blockQuoteElement.nextSibling);
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
            }
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

    private shouldToggleState(keyboardEvent: KeyboardEvent, node: Node) {
        return (
            (keyboardEvent.which == KEY_ENTER ||
                (keyboardEvent.which == KEY_BACKSPACE && node == node.parentNode.firstChild)) &&
            isNodeEmpty(node)
        );
    }
}

/**
 * @deprecated Use ContentEdit instead
 */
export class TabIndent extends ContentEdit {
    constructor(onlyBegin: boolean = false) {
        super();
    }
}
