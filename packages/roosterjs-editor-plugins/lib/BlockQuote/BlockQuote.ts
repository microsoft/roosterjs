import { getBlockQuoteElement, getNodeAtCursor } from 'roosterjs-editor-api';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    ContentScope,
    ContentPosition,
} from 'roosterjs-editor-types';

const KEY_ENTER = 13;

// An editor plugin to handle blockquote event
export default class BlockQuote implements EditorPlugin {
    private editor: Editor;

    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    public dispose(): void {
        this.editor = null;
    }

    // Handle the event
    public onPluginEvent(event: PluginEvent): void {
        let nodeAtCursor = getNodeAtCursor(this.editor);
        let [isBlockQuoteEvent, blockQuoteElement] = this.isBlockQuoteEvent(event, [KEY_ENTER], nodeAtCursor);

        if (isBlockQuoteEvent) {
            let contentTraverser = this.editor.getContentTraverser(ContentScope.Selection);
            let blockElement = contentTraverser.currentBlockElement;

            // If current block is empty, delete the corresponding node and insert a br node after current blockquote
            let content = blockElement.getTextContent().replace(/\u200B/g, '');
            if (!content) {
                let childCount = blockQuoteElement.childNodes.length;
                this.editor.deleteNode(nodeAtCursor);
                let range = this.editor.getSelectionRange();
                range.setEndAfter(blockQuoteElement);
                range.collapse(false);
                let brNode = this.editor.getDocument().createElement('br');
                this.editor.updateSelection(range);
                this.editor.insertNode(brNode, {
                    position: ContentPosition.SelectionStart,
                    updateCursor: false,
                    replaceSelection: true,
                    insertOnNewLine: false,
                });

                // If the current node is the only child in blockquote, delete the blockquote
                if (childCount == 1) {
                    this.editor.deleteNode(blockQuoteElement);
                }
            }
        }
    }

    private isBlockQuoteEvent(event: PluginEvent, interestedKeyCodes: number[], nodeAtCursor: Node): [boolean, Node] {
        let isBlockQuoteEvent = false;
        let blockQuoteElement: Node;

        if (event.eventType == PluginEventType.KeyDown) {
            let keybordEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
            blockQuoteElement = getBlockQuoteElement(this.editor, nodeAtCursor);
            isBlockQuoteEvent = !!blockQuoteElement &&
                interestedKeyCodes.indexOf(keybordEvent.which) >= 0 &&
                !keybordEvent.ctrlKey &&
                !keybordEvent.altKey &&
                !keybordEvent.metaKey;
        }

        return [isBlockQuoteEvent, blockQuoteElement];
    }
}
