import { cacheGetEventData } from 'roosterjs-editor-dom';
import { convertDomSelectionToRangeEx } from '../editor/utils/selectionConverter';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelSelectionChangedEvent } from 'roosterjs-content-model-types';
import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    SelectionChangedEvent,
} from 'roosterjs-editor-types';

const ExclusivelyHandleEventPluginKey = '__ExclusivelyHandleEventPlugin';

/**
 * Translate Standalone editor event type to legacy event type
 */
class EventTypeTranslatePlugin implements EditorPlugin {
    constructor(
        private outerPlugins: EditorPlugin[],
        private disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void
    ) {}

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
    initialize(editor: IEditor) {
        this.outerPlugins.forEach(plugin => plugin.initialize(editor));
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        for (let i = this.outerPlugins.length - 1; i >= 0; i--) {
            const plugin = this.outerPlugins[i];

            try {
                plugin.dispose();
            } catch (e) {
                this.disposeErrorHandler?.(plugin, e as Error);
            }
        }
    }

    willHandleEventExclusively(event: PluginEvent) {
        for (let i = 0; i < this.outerPlugins.length; i++) {
            const plugin = this.outerPlugins[i];

            if (plugin.willHandleEventExclusively?.(event)) {
                cacheGetEventData(event, ExclusivelyHandleEventPluginKey, () => plugin);
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

        const exclusivelyHandleEventPlugin = cacheGetEventData(
            event,
            ExclusivelyHandleEventPluginKey,
            () => undefined
        ) as EditorPlugin | undefined;

        if (exclusivelyHandleEventPlugin) {
            exclusivelyHandleEventPlugin.onPluginEvent?.(event);
        } else {
            this.outerPlugins.forEach(plugin => plugin.onPluginEvent?.(event));
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
export function createEventTypeTranslatePlugin(
    outerPlugins: EditorPlugin[],
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void
): EditorPlugin {
    return new EventTypeTranslatePlugin(outerPlugins, disposeErrorHandler);
}
