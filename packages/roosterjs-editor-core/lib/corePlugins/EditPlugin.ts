import Editor from '../editor/Editor';
import EditorPlugin from '../interfaces/EditorPlugin';
import { GenericContentEditFeature, Keys } from '../interfaces/ContentEditFeature';
import {
    ChangeSource,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';

/**
 * Edit Component helps handle Content edit features
 */
export default class EditPlugin implements EditorPlugin {
    private editor: Editor;
    private currentFeature: GenericContentEditFeature<PluginEvent> = null;
    private featureMap: { [key: number]: GenericContentEditFeature<PluginEvent>[] } = {};

    private autoCompleteSnapshot: string = null;
    private autoCompleteChangeSource: string = null;

    getName() {
        return 'Edit';
    }

    initialize(editor: Editor) {
        this.editor = editor;
        this.addFeature({
            keys: [Keys.BACKSPACE],
            shouldHandleEvent: () => this.autoCompleteSnapshot !== null,
            handleEvent: (event: PluginKeyboardEvent, editor: Editor) => {
                event.rawEvent.preventDefault();
                editor.setContent(this.autoCompleteSnapshot, false /*triggerContentChangedEvent*/);
            },
        });
    }

    dispose() {
        this.editor = null;
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        let contentChanged = false;

        switch (event.eventType) {
            case PluginEventType.ContentChanged:
                if (this.autoCompleteChangeSource != event.source) {
                    contentChanged = true;
                }
                if (!this.currentFeature) {
                    this.findFeature(event);
                }
                break;
            case PluginEventType.MouseDown:
                contentChanged = true;
                break;
            case PluginEventType.KeyDown:
                contentChanged = true;
                break;
        }

        if (this.currentFeature) {
            let feature = this.currentFeature;
            this.currentFeature = null;
            feature.handleEvent(event, this.editor);
        }

        if (contentChanged) {
            this.autoCompleteSnapshot = null;
            this.autoCompleteChangeSource = null;
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        this.findFeature(event);
        return !!this.currentFeature;
    }

    /**
     * Add a Content Edit feature
     * @param feature The feature to add
     */
    addFeature(feature: GenericContentEditFeature<PluginEvent>) {
        if (feature.initialize) {
            feature.initialize(this.editor);
        }

        feature.keys.forEach(key => {
            let array = this.featureMap[key] || [];
            array.push(feature);
            this.featureMap[key] = array;
        });
    }

    /**
     * Perform an auto complete action in the callback, save a snapsnot of content before the action,
     * and trigger ContentChangedEvent with the change source if specified
     * @param callback The auto complete callback, return value will be used as data field of ContentChangedEvent
     * @param changeSource Chagne source of ContentChangedEvent. If not passed, no ContentChangedEvent will be  triggered
     */
    performAutoComplete(callback: () => any, changeSource?: ChangeSource | string) {
        this.editor.addUndoSnapshot((start, end, snapshot) => {
            let data = callback();
            this.autoCompleteSnapshot = snapshot;
            this.autoCompleteChangeSource = changeSource;
            return data;
        }, changeSource);
    }

    private findFeature(event: PluginEvent) {
        let hasFunctionKey = false;
        let features: GenericContentEditFeature<PluginEvent>[];

        if (event.eventType == PluginEventType.KeyDown) {
            let rawEvent = event.rawEvent;
            hasFunctionKey = rawEvent.ctrlKey || rawEvent.altKey || rawEvent.metaKey;
            features = this.featureMap[rawEvent.which];
        } else if (event.eventType == PluginEventType.ContentChanged) {
            features = this.featureMap[Keys.CONTENTCHANGED];
        }
        this.currentFeature =
            features &&
            features.filter(
                feature =>
                    (feature.allowFunctionKeys || !hasFunctionKey) &&
                    feature.shouldHandleEvent(event, this.editor)
            )[0];
    }
}
