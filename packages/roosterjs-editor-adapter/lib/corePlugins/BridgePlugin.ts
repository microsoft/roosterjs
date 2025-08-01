import { cacheGetEventData } from 'roosterjs-content-model-dom';
import { createDarkColorHandler } from '../editor/DarkColorHandlerImpl';
import { createEditPlugin } from './EditPlugin';
import { IgnoredPluginNames } from '../editor/IgnoredPluginNames';
import { newEventToOldEvent, oldEventToNewEvent } from '../editor/utils/eventConverter';
import type {
    EditorPlugin as LegacyEditorPlugin,
    PluginEvent as LegacyPluginEvent,
    ContextMenuProvider as LegacyContextMenuProvider,
    IEditor as ILegacyEditor,
    ExperimentalFeatures,
    SizeTransformer,
    EditPluginState,
    CustomData,
    DarkColorHandler,
} from 'roosterjs-editor-types';
import type { ContextMenuProvider, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import type { MixedPlugin } from '../publicTypes/MixedPlugin';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';
const OldEventKey = '__OldEventFromNewEvent';

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
    private editor: IEditor | null = null;
    private legacyPlugins: LegacyEditorPlugin[];
    private edit: EditPluginState;
    private contextMenuProviders: LegacyContextMenuProvider<any>[];
    private checkExclusivelyHandling: boolean;

    constructor(
        private onInitialize: (core: EditorAdapterCore) => ILegacyEditor,
        legacyPlugins: LegacyEditorPlugin[] = [],
        private experimentalFeatures: string[] = []
    ) {
        const editPlugin = createEditPlugin();

        this.legacyPlugins = [
            editPlugin,
            ...legacyPlugins.filter(x => !!x && IgnoredPluginNames.indexOf(x.getName()) < 0),
        ];
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
        this.editor = editor;
        this.legacyPlugins.forEach(plugin => {
            plugin.initialize(outerEditor);

            if (isMixedPlugin(plugin)) {
                plugin.initializeV9(editor);
            }
        });
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        for (let i = this.legacyPlugins.length - 1; i >= 0; i--) {
            const plugin = this.legacyPlugins[i];

            plugin.dispose();
        }
        this.editor = null;
    }

    willHandleEventExclusively(event: PluginEvent) {
        return this.checkExclusivelyHandling && !!this.cacheGetExclusivelyHandlePlugin(event);
    }

    onPluginEvent(event: PluginEvent) {
        const oldEvent = this.cacheGetOldEvent(event);

        const exclusivelyHandleEventPlugin = this.cacheGetExclusivelyHandlePlugin(event);

        if (exclusivelyHandleEventPlugin) {
            this.handleEvent(exclusivelyHandleEventPlugin, oldEvent, event);
        } else {
            this.legacyPlugins.forEach(plugin => this.handleEvent(plugin, oldEvent, event));
        }

        if (oldEvent) {
            Object.assign(
                event,
                oldEventToNewEvent(
                    oldEvent,
                    event,
                    this.editor?.getEnvironment().domToModelSettings
                )
            );
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
            const oldEvent = this.cacheGetOldEvent(event);

            for (let i = 0; i < this.legacyPlugins.length; i++) {
                const plugin = this.legacyPlugins[i];

                if (oldEvent && plugin.willHandleEventExclusively?.(oldEvent)) {
                    return plugin;
                }

                if (isMixedPlugin(plugin) && plugin.willHandleEventExclusivelyV9?.(event)) {
                    return plugin;
                }
            }

            return null;
        });
    }

    private cacheGetOldEvent(event: PluginEvent) {
        return cacheGetEventData(event, OldEventKey, newEventToOldEvent);
    }

    private createEditorCore(editor: IEditor): EditorAdapterCore {
        return {
            customData: {},
            experimentalFeatures: (this.experimentalFeatures as ExperimentalFeatures[]) ?? [],
            sizeTransformer: createSizeTransformer(editor),
            darkColorHandler: createDarkColorHandler(editor.getColorManager()),
            edit: this.edit,
            contextMenuProviders: this.contextMenuProviders,
        };
    }

    private handleEvent(
        plugin: LegacyEditorPlugin,
        oldEvent: LegacyPluginEvent | undefined,
        newEvent: PluginEvent
    ) {
        if (oldEvent && plugin.onPluginEvent) {
            plugin.onPluginEvent(oldEvent);
        }

        if (isMixedPlugin(plugin)) {
            plugin.onPluginEventV9?.(newEvent);
        }
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

function isMixedPlugin(plugin: LegacyEditorPlugin): plugin is MixedPlugin {
    return !!(plugin as MixedPlugin).initializeV9;
}
