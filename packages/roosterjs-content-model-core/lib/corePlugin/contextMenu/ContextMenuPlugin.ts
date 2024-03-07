import { getSelectionRootNode } from 'roosterjs-content-model-dom';
import type {
    ContextMenuPluginState,
    ContextMenuProvider,
    IEditor,
    PluginWithState,
    EditorOptions,
} from 'roosterjs-content-model-types';

const ContextMenuButton = 2;

/**
 * Edit Component helps handle Content edit features
 */
class ContextMenuPlugin implements PluginWithState<ContextMenuPluginState> {
    private editor: IEditor | null = null;
    private state: ContextMenuPluginState;
    private disposer: (() => void) | null = null;

    /**
     * Construct a new instance of EditPlugin
     * @param options The editor options
     */
    constructor(options: EditorOptions) {
        this.state = {
            contextMenuProviders:
                options.plugins?.filter<ContextMenuProvider<any>>(isContextMenuProvider) || [],
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ContextMenu';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.attachDomEvent({
            contextmenu: {
                beforeDispatch: this.onContextMenuEvent,
            },
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.disposer?.();
        this.disposer = null;
        this.editor = null;
    }

    /**
     * Get plugin state object
     */
    getState() {
        return this.state;
    }

    private onContextMenuEvent = (e: Event) => {
        if (this.editor) {
            const allItems: any[] = [];
            const mouseEvent = e as MouseEvent;

            // ContextMenu event can be triggered from mouse right click or keyboard (e.g. Shift+F10 on Windows)
            // Need to check if this is from keyboard, we need to get target node from selection because in that case
            // event.target is always the element that attached context menu event, here it will be editor content div.
            const targetNode =
                mouseEvent.button == ContextMenuButton
                    ? (mouseEvent.target as Node)
                    : this.getFocusedNode(this.editor);

            if (targetNode) {
                this.state.contextMenuProviders.forEach(provider => {
                    const items = provider.getContextMenuItems(targetNode) ?? [];
                    if (items?.length > 0) {
                        if (allItems.length > 0) {
                            allItems.push(null);
                        }

                        allItems.push(...items);
                    }
                });
            }

            this.editor?.triggerEvent('contextMenu', {
                rawEvent: mouseEvent,
                items: allItems,
            });
        }
    };

    private getFocusedNode(editor: IEditor) {
        const selection = editor.getDOMSelection();

        if (selection) {
            if (selection.type == 'range') {
                selection.range.collapse(true /*toStart*/);
            }

            return getSelectionRootNode(selection) || null;
        } else {
            return null;
        }
    }
}

function isContextMenuProvider(source: unknown): source is ContextMenuProvider<any> {
    return !!(<ContextMenuProvider<any>>source)?.getContextMenuItems;
}

/**
 * @internal
 * Create a new instance of EditPlugin.
 */
export function createContextMenuPlugin(
    options: EditorOptions
): PluginWithState<ContextMenuPluginState> {
    return new ContextMenuPlugin(options);
}
