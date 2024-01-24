import { createContextMenuPlugin } from './ContextMenuPlugin';
import { createEditPlugin } from './EditPlugin';
import { createNormalizeTablePlugin } from './NormalizeTablePlugin';
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
} from 'roosterjs-editor-types';
import type { EditorPlugin, PluginEvent } from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements EditorPlugin {
    private legacyPlugins: LegacyEditorPlugin[];
    private corePluginState: ContentModelCorePluginState;
    private outerEditor: IContentModelEditor | null = null;
    private checkExclusivelyHandling: boolean;

    constructor(options: ContentModelEditorOptions) {
        const editPlugin = createEditPlugin();
        const contextMenuPlugin = createContextMenuPlugin(options);
        const normalizeTablePlugin = createNormalizeTablePlugin();

        this.legacyPlugins = [
            editPlugin,
            ...(options.legacyPlugins ?? []).filter(x => !!x),
            contextMenuPlugin,
            normalizeTablePlugin,
        ];
        this.corePluginState = {
            edit: editPlugin.getState(),
            contextMenu: contextMenuPlugin.getState(),
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
}
