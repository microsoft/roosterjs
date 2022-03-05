import IRibbonPlugin from './IRibbonPlugin';
import RibbonButton from './RibbonButton';
import { FormatState, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { getFormatState } from 'roosterjs-editor-api';

/**
 * A plugin to connect format ribbon component and the editor
 */
class RibbonPlugin implements IRibbonPlugin {
    private editor: IEditor;
    private onFormatChanged: (formatState: FormatState) => void;
    private timer = 0;
    private formatState: FormatState;

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
            case PluginEventType.ZoomChanged:
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
     * @param button The button that is clicked
     * @param key Key of child menu item that is clicked if any
     */
    onButtonClick(button: RibbonButton, key?: string) {
        if (this.editor) {
            this.editor.stopShadowEdit();

            if (button.onClick(this.editor, key)) {
                this.updateFormat();
            }
        }
    }

    /**
     * Enter live preview state (shadow edit) of editor if there is a non-collapsed selection
     * @param button The button that triggered this action
     * @param key Key of the hovered button sub item
     */
    startLivePreview(button: RibbonButton, key: string) {
        if (this.editor) {
            const isInShadowEdit = this.editor.isInShadowEdit();

            // If editor is already in shadow edit, no need to check again.
            // And the check result may be incorrect because the content is changed from last shadow edit and the cached selection path won't apply
            const range = !isInShadowEdit && this.editor.getSelectionRangeEx();

            if (isInShadowEdit || (range && !range.areAllCollapsed)) {
                this.editor.startShadowEdit();
                button.onClick(this.editor, key);
            }
        }
    }

    /**
     * Leave live preview state (shadow edit) of editor
     */
    stopLivePreview() {
        this.editor?.stopShadowEdit();
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
            const newFormatState = getFormatState(this.editor);

            if (
                !this.formatState ||
                Object.keys(newFormatState).some(
                    (key: keyof FormatState) => newFormatState[key] != this.formatState[key]
                )
            ) {
                this.formatState = newFormatState;
                this.onFormatChanged(newFormatState);
            }
        }
    }
}

/**
 * Create a new instance of RibbonPlugin object
 * @param delayUpdateTime The time to wait before refresh the button when user do some editing operation in editor
 */
export default function createRibbonPlugin(delayUpdateTime?: number): IRibbonPlugin {
    return new RibbonPlugin(delayUpdateTime);
}
