import { createContextMenuPlugin } from './ContextMenuPlugin';
import { createEditPlugin } from './EditPlugin';
import { createEventTypeTranslatePlugin } from './EventTypeTranslatePlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelCorePluginState } from '../publicTypes/ContentModelCorePlugins';
import type {
    ContentModelEditorOptions,
    IContentModelEditor,
} from '../publicTypes/IContentModelEditor';
import type { EditorPlugin as LegacyEditorPlugin, PluginEvent } from 'roosterjs-editor-types';
import type { EditorPlugin } from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements EditorPlugin {
    private legacyPlugins: LegacyEditorPlugin[];
    private corePluginState: ContentModelCorePluginState;
    private outerEditor: IContentModelEditor | null = null;

    constructor(options: ContentModelEditorOptions) {
        const translatePlugin = createEventTypeTranslatePlugin();
        const editPlugin = createEditPlugin();
        const contextMenuPlugin = createContextMenuPlugin(options);
        const normalizeTablePlugin = createNormalizeTablePlugin();

        this.legacyPlugins = [
            translatePlugin,
            editPlugin,
            ...(options.legacyPlugins ?? []).filter(x => !!x),
            contextMenuPlugin,
            normalizeTablePlugin,
        ];
        this.corePluginState = {
            edit: editPlugin.getState(),
            contextMenu: contextMenuPlugin.getState(),
        };
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
        for (let i = 0; i < this.legacyPlugins.length; i++) {
            const plugin = this.legacyPlugins[i];

            if (plugin.willHandleEventExclusively?.(event)) {
                if (!event.eventDataCache) {
                    event.eventDataCache = {};
                }

                event.eventDataCache[ExclusivelyHandleEventPluginKey] = plugin;
                return true;
            }
        }

        return false;
    }

    onPluginEvent(event: PluginEvent) {
        const exclusivelyHandleEventPlugin = event.eventDataCache?.[
            ExclusivelyHandleEventPluginKey
        ] as EditorPlugin | undefined;

        if (exclusivelyHandleEventPlugin) {
            exclusivelyHandleEventPlugin.onPluginEvent?.(event);
        } else {
            this.legacyPlugins.forEach(plugin => plugin.onPluginEvent?.(event));
        }
    }
}
