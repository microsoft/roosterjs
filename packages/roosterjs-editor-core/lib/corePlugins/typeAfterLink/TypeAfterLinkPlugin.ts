import createWrapper from '../utils/createWrapper';
import { Browser, LinkInlineElement, Position } from 'roosterjs-editor-dom';
import { cacheGetContentSearcher } from '../../eventApi/cacheGetContentSearcher';
import {
    BrowserInfo,
    IEditor,
    PluginEvent,
    PluginEventType,
    PluginWithState,
    PositionType,
    Wrapper,
} from 'roosterjs-editor-types';

/**
 * TypeAfterLinkPlugin Component helps handle typing event when cursor is right after a link.
 * When typing/pasting after a link, browser may put the new charactor inside link.
 * This plugin overrides this behavior to always insert outside of link.
 */
export default class TypeAfterLinkPlugin implements PluginWithState<BrowserInfo> {
    private editor: IEditor;
    private state: Wrapper<BrowserInfo>;

    /**
     * Construct a new instance of PendingFormatStatePlugin
     * @param options The editor options
     * @param contentDiv The editor content DIV
     */
    constructor() {
        this.state = createWrapper(Browser);
    }

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
     * Get the state object of this plugin
     */
    getState() {
        return this.state;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (
            (this.state.value.isFirefox && event.eventType == PluginEventType.KeyPress) ||
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
