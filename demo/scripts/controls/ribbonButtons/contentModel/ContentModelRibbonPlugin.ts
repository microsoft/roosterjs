import ContentModelRibbonButton from './ContentModelRibbonButton';
import RibbonPlugin from './RibbonPlugin';
import { FormatState } from 'roosterjs-editor-types';
import { getFormatState } from 'roosterjs-content-model-api';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { LocalizedStrings, UIUtilities } from 'roosterjs-react';
import {
    ContentModelFormatState,
    IStandaloneEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

export class ContentModelRibbonPlugin implements RibbonPlugin {
    private editor: IStandaloneEditor | null = null;
    private onFormatChanged: ((formatState: FormatState) => void) | null = null;
    private timer = 0;
    private formatState: ContentModelFormatState | null = null;
    private uiUtilities: UIUtilities | null = null;

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
    initialize(editor: IStandaloneEditor) {
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
            case 'editorReady':
            case 'contentChanged':
            case 'zoomChanged':
                this.updateFormat();
                break;

            case 'keyDown':
            case 'mouseUp':
                this.delayUpdate();
                break;
        }
    }

    /**
     * Set the UI utilities objects to this plugin to help render additional UI elements
     * @param uiUtilities The UI utilities object to set
     */
    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
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
     * @param strings The localized string map for this button
     */
    onButtonClick<T extends string>(
        button: ContentModelRibbonButton<T>,
        key: T,
        strings?: LocalizedStrings<T>
    ) {
        if (this.editor && this.uiUtilities) {
            this.editor.stopShadowEdit();

            button.onClick(this.editor, key, strings, this.uiUtilities);

            if (button.isChecked || button.isDisabled || button.dropDownMenu?.getSelectedItemKey) {
                this.updateFormat();
            }
        }
    }

    /**
     * Enter live preview state (shadow edit) of editor if there is a non-collapsed selection
     * @param button The button that triggered this action
     * @param key Key of the hovered button sub item
     * @param strings The localized string map for this button
     */
    startLivePreview<T extends string>(
        button: ContentModelRibbonButton<T>,
        key: T,
        strings?: LocalizedStrings<T>
    ) {
        if (this.editor && this.uiUtilities) {
            const isInShadowEdit = this.editor.isInShadowEdit();

            // If editor is already in shadow edit, no need to check again.
            // And the check result may be incorrect because the content is changed from last shadow edit and the cached selection path won't apply
            const range = !isInShadowEdit && this.editor.getDOMSelection();

            if (isInShadowEdit || (range && (range.type != 'range' || !range.range.collapsed))) {
                this.editor.startShadowEdit();
                button.onClick(this.editor, key, strings, this.uiUtilities);
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
        const window = this.editor?.getDocument().defaultView;

        if (!window) {
            return;
        }

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
                getObjectKeys(newFormatState).some(
                    key => newFormatState[key] != this.formatState?.[key]
                )
            ) {
                this.formatState = newFormatState;
                this.onFormatChanged(newFormatState);
            }
        }
    }
}
