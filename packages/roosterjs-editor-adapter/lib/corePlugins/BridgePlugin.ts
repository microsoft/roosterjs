import { cacheGetEventData } from 'roosterjs-content-model-core';
import { createDarkColorHandler } from '../editor/DarkColorHandlerImpl';
import { createEditPlugin } from './EditPlugin';
import { newEventToOldEvent, oldEventToNewEvent } from '../editor/utils/eventConverter';
import type {
    EditorPlugin as LegacyEditorPlugin,
    ContextMenuProvider as LegacyContextMenuProvider,
    IEditor as ILegacyEditor,
    ExperimentalFeatures,
    SizeTransformer,
    EditPluginState,
    CustomData,
    DarkColorHandler,
} from 'roosterjs-editor-types';
import type { ContextMenuProvider, IEditor, PluginEvent } from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Represents the core data structure of a editor adapter
 */
export interface EditorAdapterCore {
    /**
     * Custom data of this editor
     */
    readonly customData: Record<string, CustomData>;

    /**
     * Enabled experimental features
     */
    readonly experimentalFeatures: ExperimentalFeatures[];

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    readonly darkColorHandler: DarkColorHandler;

    /**
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * Context Menu providers
     */
    readonly contextMenuProviders: LegacyContextMenuProvider<any>[];

    /**
     * @deprecated Use zoomScale instead
     */
    readonly sizeTransformer: SizeTransformer;
}

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements ContextMenuProvider<any> {
    private legacyPlugins: LegacyEditorPlugin[];
    private edit: EditPluginState;
    private contextMenuProviders: LegacyContextMenuProvider<any>[];
    private checkExclusivelyHandling: boolean;

    constructor(
        private onInitialize: (core: EditorAdapterCore) => ILegacyEditor,
        legacyPlugins: LegacyEditorPlugin[] = [],
        private experimentalFeatures: ExperimentalFeatures[] = []
    ) {
        const editPlugin = createEditPlugin();

        this.legacyPlugins = [editPlugin, ...legacyPlugins.filter(x => !!x)];
        this.edit = editPlugin.getState();
        this.contextMenuProviders = this.legacyPlugins.filter(isContextMenuProvider);
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
    initialize(editor: IEditor) {
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
        return this.checkExclusivelyHandling && !!this.cacheGetExclusivelyHandlePlugin(event);
    }

    onPluginEvent(event: PluginEvent) {
        const oldEvent = newEventToOldEvent(event);

        if (oldEvent) {
            const exclusivelyHandleEventPlugin = this.cacheGetExclusivelyHandlePlugin(event);

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

        this.contextMenuProviders.forEach(provider => {
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

    private cacheGetExclusivelyHandlePlugin(event: PluginEvent) {
        return cacheGetEventData(event, ExclusivelyHandleEventPluginKey, event => {
            const oldEvent = newEventToOldEvent(event);

            if (oldEvent) {
                for (let i = 0; i < this.legacyPlugins.length; i++) {
                    const plugin = this.legacyPlugins[i];

                    if (plugin.willHandleEventExclusively?.(oldEvent)) {
                        return plugin;
                    }
                }
            }

            return null;
        });
    }

    private createEditorCore(editor: IEditor): EditorAdapterCore {
        return {
            customData: {},
            experimentalFeatures: this.experimentalFeatures ?? [],
            sizeTransformer: createSizeTransformer(editor),
            darkColorHandler: createDarkColorHandler(editor.getColorManager()),
            edit: this.edit,
            contextMenuProviders: this.contextMenuProviders,
        };
    }
}

/**
 * @internal Export for test only. This function is only used for compatibility from older build

 */
export function createSizeTransformer(editor: IEditor): SizeTransformer {
    return size => size / editor.getDOMHelper().calculateZoomScale();
}

function isContextMenuProvider(
    source: LegacyEditorPlugin
): source is LegacyContextMenuProvider<any> {
    return !!(<LegacyContextMenuProvider<any>>source)?.getContextMenuItems;
}
