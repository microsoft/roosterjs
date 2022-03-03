import IRibbonPlugin from './IRibbonPlugin';
import RibbonButton from './RibbonButton';
import { FormatState, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getFormatState } from 'roosterjs-editor-api';

/**
 * A plugin to connect format ribbon component and the editor
 */
export default class RibbonPlugin implements IRibbonPlugin {
    private editor: IEditor;
    private onFormatChanged: (formatState: FormatState) => void;
    private timer = 0;

    /**
     * Construct a new instance of RibbonPlugin object
     * @param delayUpdateTime The time to wait before refresh the button when user do some editing operation in editor
     */
    constructor(private delayUpdateTime: number = 200) {}

    /**
     * Get a friendly name of this plugin
     */
    getName() {
        return 'Ribbon';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
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
        switch (event.eventType) {
            case PluginEventType.EditorReady:
            case PluginEventType.ContentChanged:
                this.updateFormat();
                break;

            case PluginEventType.KeyDown:
            case PluginEventType.MouseDown:
                this.delayUpdate();
                break;
        }
    }

    /**
     * Register a callback to be invoked when format state of editor is changed, returns a disposer function.
     */
    registerFormatChangedCallback(callback: (formatState: FormatState) => void) {
        this.onFormatChanged = callback;

        return () => {
            this.onFormatChanged = null;
        };
    }

    /**
     * When user clicks on a button, call this method to let the plugin to handle this click event
     */
    onButtonClick(button: RibbonButton) {
        if (this.editor && button.onClick(this.editor)) {
            this.updateFormat();
        }
    }

    private delayUpdate() {
        const window = this.editor.getDocument().defaultView;

        if (this.timer) {
            window.clearTimeout(this.timer);
        }

        this.timer = window.setTimeout(() => {
            this.timer = 0;
            this.updateFormat?.();
        }, this.delayUpdateTime);
    }

    private updateFormat() {
        if (this.editor && this.onFormatChanged) {
            const formatState = getFormatState(this.editor);
            this.onFormatChanged(formatState);
        }
    }
}
