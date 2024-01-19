import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelEditorOptions } from '../publicTypes/IContentModelEditor';
import type { ContextMenuPluginState } from '../publicTypes/ContextMenuPluginState';
import type {
    ContextMenuProvider,
    EditorPlugin,
    IEditor,
    PluginEvent,
    PluginWithState,
} from 'roosterjs-editor-types';

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
    constructor(options: ContentModelEditorOptions) {
        this.state = {
            contextMenuProviders:
                options.legacyPlugins?.filter<ContextMenuProvider<any>>(isContextMenuProvider) ||
                [],
        };
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Edit';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.disposer = this.editor.addDomEventHandler('contextmenu', this.onContextMenuEvent);
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

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {}

    private onContextMenuEvent = (e: Event) => {
        const event = e as MouseEvent;
        const allItems: any[] = [];

        // TODO: Remove dependency to ContentSearcher
        const searcher = this.editor?.getContentSearcherOfCursor();
        const elementBeforeCursor = searcher?.getInlineElementBefore();

        let eventTargetNode = event.target as Node;
        if (event.button != 2 && elementBeforeCursor) {
            eventTargetNode = elementBeforeCursor.getContainerNode();
        }
        this.state.contextMenuProviders.forEach(provider => {
            const items = provider.getContextMenuItems(eventTargetNode) ?? [];
            if (items?.length > 0) {
                if (allItems.length > 0) {
                    allItems.push(null);
                }

                allItems.push(...items);
            }
        });
        this.editor?.triggerPluginEvent(PluginEventType.ContextMenu, {
            rawEvent: event,
            items: allItems,
        });
    };
}

function isContextMenuProvider(source: EditorPlugin): source is ContextMenuProvider<any> {
    return !!(<ContextMenuProvider<any>>source)?.getContextMenuItems;
}

/**
 * @internal
 * Create a new instance of EditPlugin.
 */
export function createContextMenuPlugin(
    options: ContentModelEditorOptions
): PluginWithState<ContextMenuPluginState> {
    return new ContextMenuPlugin(options);
}
