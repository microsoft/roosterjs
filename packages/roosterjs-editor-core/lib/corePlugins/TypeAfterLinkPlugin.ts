import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { Browser, LinkInlineElement, Position } from 'roosterjs-editor-dom';
import { cacheGetContentSearcher } from '../eventApi/cacheGetContentSearcher';
import { PluginEvent, PluginEventType, PositionType } from 'roosterjs-editor-types';

/**
 * TypeAfterLinkPlugin Component helps handle typing event when cursor is right after a link.
 * When typing/pasting after a link, browser may put the new charactor inside link.
 * This plugin overrides this behavior to always insert outside of link.
 */
export default class TypeAfterLinkPlugin implements EditorPlugin {
    private editor: Editor;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TypeAfterLinkPlugin';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: Editor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            (Browser.isFirefox && event.eventType == PluginEventType.KeyPress) ||
            event.eventType == PluginEventType.BeforePaste
        ) {
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
