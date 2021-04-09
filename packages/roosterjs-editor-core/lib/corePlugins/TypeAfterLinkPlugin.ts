import { Browser, LinkInlineElement } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

/**
 * @internal
 * TypeAfterLinkPlugin Component helps handle typing event when cursor is right after a link.
 * When typing/pasting after a link, browser may put the new charactor inside link.
 * This plugin overrides this behavior to always insert outside of link.
 */
export default class TypeAfterLinkPlugin implements EditorPlugin {
    private editor: IEditor;

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'TypeAfterLink';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
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
                const searcher = this.editor.getContentSearcherOfCursor(event);
                const inlineElementBefore = searcher.getInlineElementBefore();
                const inlineElementAfter = searcher.getInlineElementAfter();
                if (inlineElementBefore instanceof LinkInlineElement) {
                    this.editor.select(inlineElementBefore.getContainerNode(), PositionType.After);
                } else if (inlineElementAfter instanceof LinkInlineElement) {
                    this.editor.select(inlineElementAfter.getContainerNode(), PositionType.Before);
                }
            }
        }
    }
}
