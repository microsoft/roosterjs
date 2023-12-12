import { convertDomSelectionToRangeEx } from '../editor/utils/selectionConverter';
import { PluginEventType } from 'roosterjs-editor-types';
import type { ContentModelSelectionChangedEvent } from 'roosterjs-content-model-types';
import type { EditorPlugin, PluginEvent, SelectionChangedEvent } from 'roosterjs-editor-types';

/**
 * Translate Standalone editor event type to legacy event type
 */
class EventTypeTranslatePlugin implements EditorPlugin {
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
     * Dispose this plugin
     */
    dispose() {}

    onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.SelectionChanged:
                if (!event.selectionRangeEx && isContentModelSelectionChangedEvent(event)) {
                    event.selectionRangeEx = convertDomSelectionToRangeEx(event.newSelection);
                }
                break;
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
export function createEventTypeTranslatePlugin(): EditorPlugin {
    return new EventTypeTranslatePlugin();
}
