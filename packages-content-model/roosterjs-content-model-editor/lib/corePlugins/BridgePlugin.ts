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
    private wrapperPlugins: LegacyEditorPlugin[] = [];

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
     * Add plugins for wrapper editor
     */
    addWrapperPlugin(wrapperPlugins: LegacyEditorPlugin[]) {
        this.wrapperPlugins.push(...wrapperPlugins);
    }

    /**
     * Initialize all inner plugins with Content Model Editor
     */
    setOuterEditor(editor: IContentModelEditor) {
        this.wrapperPlugins.forEach(plugin => plugin.initialize(editor));

        this.wrapperPlugins.forEach(plugin =>
            plugin.onPluginEvent?.({
                eventType: PluginEventType.EditorReady,
            })
        );
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        for (let i = this.wrapperPlugins.length - 1; i >= 0; i--) {
            const plugin = this.wrapperPlugins[i];

            plugin.dispose();
        }
    }

    willHandleEventExclusively(event: PluginEvent) {
        for (let i = 0; i < this.wrapperPlugins.length; i++) {
            const plugin = this.wrapperPlugins[i];

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
            this.wrapperPlugins.forEach(plugin => plugin.onPluginEvent?.(event));
        }
    }
}

function isContentModelSelectionChangedEvent(
    event: SelectionChangedEvent
): event is ContentModelSelectionChangedEvent {
    return !!(event as ContentModelSelectionChangedEvent).newSelection;
}
