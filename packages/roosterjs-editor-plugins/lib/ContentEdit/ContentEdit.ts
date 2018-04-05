import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ContentChangedEvent,
    ChangeSource,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import ContentEditFeatures, {
    ContentEditFeature,
    getDefaultContentEditFeatures,
} from './ContentEditFeatures';
import {
    AutoBullet,
    IndentOutdentWhenTab,
    MergeInNewLine,
    OutdentBSEmptyLine1,
    OutdentWhenEnterOnEmptyLine,
} from './features/ListFeatures';
import { AutoLink1, AutoLink2 } from './features/autoLinkFeatures';
import { UnquoteBSEmptyLine1, UnquoteWhenEnterOnEmptyLine } from './features/quoteFeatures';
import { TabInTable } from './features/tableFeatures';

const KEY_BACKSPACE = 8;

/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 * 4. Auto bullet/numbering
 * 5. Auto link
 * 6. Tab in table
 */
export default class ContentEdit implements EditorPlugin {
    private editor: Editor;
    private features: ContentEditFeature[] = [];
    private keys: number[] = [];
    private backspaceUndoEventSource: ChangeSource;
    private currentFeature: ContentEditFeature;
    private autoLinkEnabled: boolean;

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(featureSet?: ContentEditFeatures) {
        featureSet = featureSet || getDefaultContentEditFeatures();
        this.addFeature(featureSet.indentOutdentWhenTab, IndentOutdentWhenTab);
        this.addFeature(featureSet.outdentWhenBackspaceOnEmptyFirstLine, OutdentBSEmptyLine1);
        this.addFeature(featureSet.outdentWhenEnterOnEmptyLine, OutdentWhenEnterOnEmptyLine);
        this.addFeature(featureSet.mergeInNewLineWhenBackspaceOnFirstChar, MergeInNewLine);
        this.addFeature(featureSet.unquoteWhenBackspaceOnEmptyFirstLine, UnquoteBSEmptyLine1);
        this.addFeature(featureSet.unquoteWhenEnterOnEmptyLine, UnquoteWhenEnterOnEmptyLine);
        this.addFeature(featureSet.tabInTable, TabInTable);
        this.addFeature(featureSet.autoBullet, AutoBullet);
        this.addFeature(featureSet.autoLink, AutoLink1);
        this.addFeature(featureSet.autoLink, AutoLink2);
        this.autoLinkEnabled = featureSet.autoLink;
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = null;
    }

    /**
     * Check whether the event should be handled exclusively by this plugin
     */
    public willHandleEventExclusively(event: PluginEvent): boolean {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        if (
            event.eventType == PluginEventType.KeyDown &&
            this.keys.indexOf(keyboardEvent.which) >= 0 &&
            !keyboardEvent.ctrlKey &&
            !keyboardEvent.altKey &&
            !keyboardEvent.metaKey
        ) {
            for (let feature of this.features) {
                if (
                    feature.key == keyboardEvent.which &&
                    feature.shouldHandleEvent(event as PluginDomEvent, this.editor)
                ) {
                    this.currentFeature = feature;
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Handle the event
     */
    public onPluginEvent(event: PluginEvent) {
        let keyboardEvent = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        if (event.eventType == PluginEventType.KeyDown && this.backspaceUndoEventSource) {
            this.backspaceUndoEventSource = null;
            if (keyboardEvent.which == KEY_BACKSPACE) {
                keyboardEvent.preventDefault();
                this.editor.undo();
            }
        } else if (event.eventType == PluginEventType.KeyDown && this.currentFeature) {
            let feature = this.currentFeature;
            this.currentFeature = null;
            this.backspaceUndoEventSource = <ChangeSource>feature.handleEvent(
                event as PluginDomEvent,
                this.editor
            );
        } else if (event.eventType == PluginEventType.ContentChanged) {
            let contentChangedEvent = <ContentChangedEvent>event;
            if (
                this.backspaceUndoEventSource &&
                contentChangedEvent.source != this.backspaceUndoEventSource
            ) {
                this.backspaceUndoEventSource = null;
            }
            if (
                contentChangedEvent.source == ChangeSource.Paste &&
                this.autoLinkEnabled &&
                AutoLink1.shouldHandleEvent(event as PluginDomEvent, this.editor)
            ) {
                AutoLink1.handleEvent(event as PluginDomEvent, this.editor);
            }
        }
    }

    private addFeature(add: boolean, feature: ContentEditFeature) {
        if (add) {
            this.features.push(feature);
            if (this.keys.indexOf(feature.key) < 0) {
                this.keys.push(feature.key);
            }
        }
    }
}
