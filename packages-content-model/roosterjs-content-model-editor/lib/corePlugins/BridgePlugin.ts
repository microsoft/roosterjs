import { createEditPlugin } from './EditPlugin';
import { createEntityDelimiterPlugin } from './EntityDelimiterPlugin';
import { newEventToOldEvent, oldEventToNewEvent } from '../editor/utils/eventConverter';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../publicTypes/IContentModelEditor';
import type {
    EditorPlugin as LegacyEditorPlugin,
    PluginEvent as LegacyPluginEvent,
    ContextMenuProvider as LegacyContextMenuProvider,
} from 'roosterjs-editor-types';
import type { ContextMenuProvider, PluginEvent } from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements ContextMenuProvider<any> {
    private legacyPlugins: LegacyEditorPlugin[];
    private corePluginState: ContentModelCorePluginState;
    private outerEditor: IContentModelEditor | null = null;
    private checkExclusivelyHandling: boolean;

    constructor(options: ContentModelEditorOptions) {
        const editPlugin = createEditPlugin();
        const entityDelimiterPlugin = createEntityDelimiterPlugin();

        this.legacyPlugins = [
            editPlugin,
            ...(options.legacyPlugins ?? []).filter(x => !!x),
            entityDelimiterPlugin,
        ];
        this.corePluginState = {
            edit: editPlugin.getState(),
            contextMenuProviders: this.legacyPlugins.filter(isContextMenuProvider),
        };
        this.checkExclusivelyHandling = this.legacyPlugins.some(
            plugin => plugin.willHandleEventExclusively
        );
    }

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Bridge';
    }

    /**
     * Get core plugin state
     */
    getCorePluginState(): ContentModelCorePluginState {
        return this.corePluginState;
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize() {
        if (this.outerEditor) {
            const editor = this.outerEditor;

            this.legacyPlugins.forEach(plugin => plugin.initialize(editor));

            this.legacyPlugins.forEach(plugin =>
                plugin.onPluginEvent?.({
                    eventType: PluginEventType.EditorReady,
                })
            );
        }
    }

    /**
     * Initialize all inner plugins with Content Model Editor
     */
    setOuterEditor(editor: IContentModelEditor) {
        this.outerEditor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        for (let i = this.legacyPlugins.length - 1; i >= 0; i--) {
            const plugin = this.legacyPlugins[i];

            plugin.dispose();
        }
    }

    willHandleEventExclusively(event: PluginEvent) {
        let oldEvent: LegacyPluginEvent | undefined;

        if (this.checkExclusivelyHandling && (oldEvent = newEventToOldEvent(event))) {
            for (let i = 0; i < this.legacyPlugins.length; i++) {
                const plugin = this.legacyPlugins[i];

                if (plugin.willHandleEventExclusively?.(oldEvent)) {
                    if (!event.eventDataCache) {
                        event.eventDataCache = {};
                    }

                    event.eventDataCache[ExclusivelyHandleEventPluginKey] = plugin;
                    return true;
                }
            }
        }

        return false;
    }

    onPluginEvent(event: PluginEvent) {
        const oldEvent = newEventToOldEvent(event);

        if (oldEvent) {
            const exclusivelyHandleEventPlugin = event.eventDataCache?.[
                ExclusivelyHandleEventPluginKey
            ] as LegacyEditorPlugin | undefined;

            if (exclusivelyHandleEventPlugin) {
                exclusivelyHandleEventPlugin.onPluginEvent?.(oldEvent);
            } else {
                this.legacyPlugins.forEach(plugin => plugin.onPluginEvent?.(oldEvent));
            }

            Object.assign(event, oldEventToNewEvent(oldEvent, event));
        }
    }

    /**
     * A callback to return context menu items
     * @param target Target node that triggered a ContextMenu event
     * @returns An array of context menu items, or null means no items needed
     */
    getContextMenuItems(target: Node): any[] {
        const allItems: any[] = [];

        this.corePluginState.contextMenuProviders.forEach(provider => {
            const items = provider.getContextMenuItems(target) ?? [];
            if (items?.length > 0) {
                if (allItems.length > 0) {
                    allItems.push(null);
                }

                allItems.push(...items);
            }
        });

        return allItems;
    }
}

function isContextMenuProvider(
    source: LegacyEditorPlugin
): source is LegacyContextMenuProvider<any> {
    return !!(<LegacyContextMenuProvider<any>>source)?.getContextMenuItems;
}
