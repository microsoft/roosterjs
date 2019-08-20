import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { cacheGetContentSearcher } from '../eventApi/cacheGetContentSearcher';
import { LinkInlineElement, Position } from 'roosterjs-editor-dom';
import { PluginEvent, PluginEventType, PositionType } from 'roosterjs-editor-types';

/**
 * FirefoxTypeAfterLink Component helps handle typing event when cursor is right after a link.
 * When typing after a link, Firefox will always put the new charactor inside link.
 * This plugin overrides this behavior to make it consistent with other browsers.
 */
export default class FirefoxTypeAfterLink implements EditorPlugin {
    private editor: Editor;

    getName() {
        return 'FirefoxTypeAfterLink';
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
            let range = this.editor.getSelectionRange();
            if (range && range.collapsed && this.editor.getElementAtCursor('A[href]')) {
                let searcher = cacheGetContentSearcher(event, this.editor);
                let inlineElement = searcher.getInlineElementBefore();
                if (inlineElement instanceof LinkInlineElement) {
                    this.editor.select(
                        new Position(inlineElement.getContainerNode(), PositionType.After)
                    );
                }
            }
        }
    }
}
