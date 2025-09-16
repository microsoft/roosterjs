import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { repositionTouchSelection } from './repositionTouchSelection';

const DELAY_UPDATE_TIME = 100;

/**
 * Touch plugin to manage touch behaviors
 */
export class TouchPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private timer = 0;

    /**
     * Create an instance of Touch plugin
     */
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Touch';
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
        if (!this.editor) {
            return;
        }
        switch (event.eventType) {
            case 'pointerUp':
                this.delayUpdate();
                break;
        }
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
            if (this.editor) {
                repositionTouchSelection(this.editor);
            }
        }, DELAY_UPDATE_TIME);
    }
}
