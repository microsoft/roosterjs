import { createElement } from 'roosterjs-editor-dom';
import {
    EditorPlugin,
    IEditor,
    KnownCreateElementDataIndex,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * Context Menu options for ContextMenu plugin
 */
export interface ContextMenuOptions<T> {
    /**
     * Render function for the context menu
     * @param container The container HTML element, it will be located at the mouse click position,
     * so the callback just need to render menu content into this container
     * @param onDismiss The onDismiss callback, some menu render need to know this callback so that
     * it can handle the dismiss event
     */
    render: (container: HTMLElement, items: (T | null)[], onDismiss: () => void) => void;

    /**
     * Dismiss function for the context menu, it will be called when user wants to dismiss this context menu
     * e.g. user click away so the menu should be dismissed
     * @param container The container HTML element
     */
    dismiss?: (container: HTMLElement) => void;

    /**
     * Whether the default context menu is allowed. @default false
     */
    allowDefaultMenu?: boolean;
}

/**
 * An editor plugin that support showing a context menu using render() function from options parameter
 */
export default class ContextMenu<T> implements EditorPlugin {
    private container: HTMLElement | null = null;
    private editor: IEditor | null = null;
    private isMenuShowing: boolean = false;

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

        if (this.container?.parentNode) {
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

            if (this.initContainer(rawEvent.pageX, rawEvent.pageY)) {
                this.options.render(this.container!, items as T[], this.onDismiss);
                this.isMenuShowing = true;
            }
        }
    }

    private initContainer(x: number, y: number) {
        if (!this.container && this.editor) {
            this.container = createElement(
                KnownCreateElementDataIndex.ContextMenuWrapper,
                this.editor.getDocument()
            ) as HTMLElement;
            this.editor.getDocument().body.appendChild(this.container);
        }
        this.container?.style.setProperty('left', x + 'px');
        this.container?.style.setProperty('top', y + 'px');
        return !!this.container;
    }

    private onDismiss = () => {
        if (this.container && this.isMenuShowing) {
            this.options.dismiss?.(this.container);
            this.isMenuShowing = false;
        }
    };
}
