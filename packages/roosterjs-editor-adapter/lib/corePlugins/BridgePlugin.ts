import { coreApiMap } from '../coreApi/coreApiMap';
import { createDarkColorHandler } from '../editor/DarkColorHandlerImpl';
import { createEditPlugin } from './EditPlugin';
import { createEntityDelimiterPlugin } from './EntityDelimiterPlugin';
import { newEventToOldEvent, oldEventToNewEvent } from '../editor/utils/eventConverter';
import type {
    ContentModelCoreApiMap,
    ContentModelEditorCore,
} from '../publicTypes/ContentModelEditorCore';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type {
    EditorPlugin as LegacyEditorPlugin,
    PluginEvent as LegacyPluginEvent,
    ContextMenuProvider as LegacyContextMenuProvider,
    IEditor as ILegacyEditor,
    ExperimentalFeatures,
    SizeTransformer,
} from 'roosterjs-editor-types';
import type {
    ContextMenuProvider,
    IStandaloneEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements ContextMenuProvider<any> {
    private legacyPlugins: LegacyEditorPlugin[];
    private corePluginState: ContentModelCorePluginState;
    private checkExclusivelyHandling: boolean;

    constructor(
        private onInitialize: (core: ContentModelEditorCore) => ILegacyEditor,
        legacyPlugins: LegacyEditorPlugin[] = [],
        private legacyCoreApiOverride?: Partial<ContentModelCoreApiMap>,
        private experimentalFeatures: ExperimentalFeatures[] = []
    ) {
        const editPlugin = createEditPlugin();
        const entityDelimiterPlugin = createEntityDelimiterPlugin();

        this.legacyPlugins = [editPlugin, ...legacyPlugins.filter(x => !!x), entityDelimiterPlugin];
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
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IStandaloneEditor) {
        const outerEditor = this.onInitialize(this.createEditorCore(editor));

        this.legacyPlugins.forEach(plugin => plugin.initialize(outerEditor));
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

    private createEditorCore(editor: IStandaloneEditor): ContentModelEditorCore {
        return {
            api: { ...coreApiMap, ...this.legacyCoreApiOverride },
            originalApi: coreApiMap,
            customData: {},
            experimentalFeatures: this.experimentalFeatures ?? [],
            sizeTransformer: createSizeTransformer(editor),
            darkColorHandler: createDarkColorHandler(editor.getColorManager()),
            ...this.corePluginState,
        };
    }
}

/**
 * @internal Export for test only. This function is only used for compatibility from older build

 */
export function createSizeTransformer(editor: IStandaloneEditor): SizeTransformer {
    return size => size / editor.getDOMHelper().calculateZoomScale();
}

function isContextMenuProvider(
    source: LegacyEditorPlugin
): source is LegacyContextMenuProvider<any> {
    return !!(<LegacyContextMenuProvider<any>>source)?.getContextMenuItems;
}
