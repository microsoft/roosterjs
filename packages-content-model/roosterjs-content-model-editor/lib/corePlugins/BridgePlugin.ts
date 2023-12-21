import { convertDomSelectionToRangeEx } from '../editor/utils/selectionConverter';
import { PluginEventType } from 'roosterjs-editor-types';
import type { IContentModelEditor } from '../publicTypes/IContentModelEditor';
import type {
    EditorPlugin as LegacyEditorPlugin,
    PluginEvent,
    SelectionChangedEvent,
} from 'roosterjs-editor-types';
import type {
    ContentModelSelectionChangedEvent,
    EditorPlugin,
} from 'roosterjs-content-model-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * @internal
 * Act as a bridge between Standalone editor and Content Model editor, translate Standalone editor event type to legacy event type
 */
export class BridgePlugin implements EditorPlugin {
    private innerPlugins: LegacyEditorPlugin[] = [];

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
    initialize() {}

    /**
     * Add inner plugins
     */
    addInnerPlugins(innerPlugins: LegacyEditorPlugin[]) {
        this.innerPlugins.push(...innerPlugins);
    }

    /**
     * Initialize all inner plugins with Content Model Editor
     * @param editor
     */
    initializeInnerPlugins(editor: IContentModelEditor) {
        this.innerPlugins.forEach(plugin => plugin.initialize(editor));

        this.innerPlugins.forEach(plugin =>
            plugin.onPluginEvent?.({
                eventType: PluginEventType.EditorReady,
            })
        );
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        for (let i = this.innerPlugins.length - 1; i >= 0; i--) {
            const plugin = this.innerPlugins[i];

            plugin.dispose();
        }
    }

    willHandleEventExclusively(event: PluginEvent) {
        for (let i = 0; i < this.innerPlugins.length; i++) {
            const plugin = this.innerPlugins[i];

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
        switch (event.eventType) {
            case PluginEventType.SelectionChanged:
                if (!event.selectionRangeEx && isContentModelSelectionChangedEvent(event)) {
                    event.selectionRangeEx = convertDomSelectionToRangeEx(event.newSelection);
                }
                break;

            case PluginEventType.EditorReady:
                // Do not dispatch EditorReady event since when inner editor is ready, outer editor is not ready yet
                return;
        }

        const exclusivelyHandleEventPlugin = event.eventDataCache?.[
            ExclusivelyHandleEventPluginKey
        ] as EditorPlugin | undefined;

        if (exclusivelyHandleEventPlugin) {
            exclusivelyHandleEventPlugin.onPluginEvent?.(event);
        } else {
            this.innerPlugins.forEach(plugin => plugin.onPluginEvent?.(event));
        }
    }
}

function isContentModelSelectionChangedEvent(
    event: SelectionChangedEvent
): event is ContentModelSelectionChangedEvent {
    return !!(event as ContentModelSelectionChangedEvent).newSelection;
}
