import { fromHtml } from 'roosterjs-editor-dom';
import {
    ContentPosition,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

const CONTAINER_HTML = '<div style="position: fixed; width: 0; height: 0"></div>';

export interface ContextMenuOptions<T> {
    render: (container: HTMLElement, items: (T | null)[], onDismiss: () => void) => void;

    dismiss?: (container: HTMLElement) => void;

    allowDefaultMenu?: boolean;
}

/**
 * An editor plugin that support showing a context menu using render() function from options parameter
 */
export default class ContextMenu<T> implements EditorPlugin {
    private container: HTMLElement;
    private editor: IEditor;
    private isMenuShowing: boolean;

    /**
     * Create a new instance of ContextMenu class
     * @param options An options object to determine how to show/hide the context menu
     */
    constructor(private options: ContextMenuOptions<T>) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ContextMenu';
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
        this.onDismiss();

        if (this.container) {
            this.container.parentNode.removeChild(this.container);
            this.container = null;
        }
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.ContextMenu && event.items.length > 0) {
            const { rawEvent, items } = event;

            this.onDismiss();

            if (!this.options.allowDefaultMenu) {
                rawEvent.preventDefault();
            }

            this.initContainer(rawEvent.pageX, rawEvent.pageY);
            this.options.render(this.container, items as T[], this.onDismiss);
            this.isMenuShowing = true;
        }
    }

    private initContainer(x: number, y: number) {
        if (!this.container) {
            this.container = fromHtml(CONTAINER_HTML, this.editor.getDocument())[0] as HTMLElement;
            this.editor.insertNode(this.container, {
                position: ContentPosition.Outside,
            });
        }
        this.container.style.left = x + 'px';
        this.container.style.top = y + 'px';
    }

    private onDismiss = () => {
        if (this.container && this.isMenuShowing) {
            this.options.dismiss?.(this.container);
            this.isMenuShowing = false;
        }
    };
}
