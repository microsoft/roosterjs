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
export interface BridgePlugin extends EditorPlugin {
    /**
     * Initialize all inner plugins with Content Model Editor
     * @param editor
     */
    initializeInnerPlugins(editor: IContentModelEditor): void;
}

class BridgePluginImpl implements BridgePlugin {
    constructor(private innerPlugins: LegacyEditorPlugin[]) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'EventTypeTranslate';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize() {}

    /**
     * Initialize all inner plugins with Content Model Editor
     * @param editor
     */
    initializeInnerPlugins(editor: IContentModelEditor) {
        this.innerPlugins.forEach(plugin => plugin.initialize(editor));
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

/**
 * @internal
 * Create a new instance of EventTypeTranslatePlugin.
 */
export function createBridgePlugin(innerPlugins: LegacyEditorPlugin[]): BridgePlugin {
    return new BridgePluginImpl(innerPlugins);
}
