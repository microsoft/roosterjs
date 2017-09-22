import { getBlockQuoteElement, getNodeAtCursor } from 'roosterjs-editor-api';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    ContentScope,
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

            // If current block is empty, delete the corresponding node and insert empty div after current blockquote
            if (!blockElement.getTextContent()) {
                this.editor.deleteNode(nodeAtCursor);
                let range = this.editor.getSelectionRange();
                range.setEndAfter(blockQuoteElement);
                range.collapse(false);
                let brNode = this.editor.getDocument().createElement('br');
                let div = this.editor.getDocument().createElement('div');
                div.appendChild(brNode);
                range.insertNode(div);
                this.editor.updateSelection(range);
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
