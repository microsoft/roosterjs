import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import {
    ChangeSource,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    ContentChangedEvent,
} from 'roosterjs-editor-types';
import ContentEditFeatures, {
    getDefaultContentEditFeatures,
    ContentEditFeature,
} from './ContentEditFeatures';

import {
    AutoBullet,
    IndentWhenTab,
    OutdentWhenShiftTab,
    MergeInNewLine,
    OutdentWhenBackOn1stEmptyLine,
    OutdentWhenEnterOnEmptyLine,
} from './features/listFeatures';
import { AutoLink } from './features/autoLinkFeatures';
import {
    UnquoteWhenBackOnEmpty1stLine,
    UnquoteWhenEnterOnEmptyLine,
} from './features/quoteFeatures';
import { TabInTable, UpDownInTable } from './features/tableFeatures';
import { DefaultShortcut } from './features/shortcutFeatures';

/**
 * An editor plugin to handle content edit event.
 * The following cases are included:
 * 1. Auto increase/decrease indentation on Tab, Shift+tab
 * 2. Enter, Backspace on empty list item
 * 3. Enter, Backspace on empty blockquote line
 * 4. Auto bullet/numbering
 * 5. Auto link
 * 6. Tab in table
 * 7. Up/Down in table
 * 8. Manage list style
 */
export default class ContentEdit implements EditorPlugin {
    private editor: Editor;
    private features: ContentEditFeature[] = [];
    private keys: number[] = [];
    private currentFeature: ContentEditFeature;
    private autoLinkEnabled: boolean;
    public name: 'ContentEdit';

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(featureSet?: ContentEditFeatures) {
        featureSet = featureSet || getDefaultContentEditFeatures();
        this.addFeature(featureSet.indentWhenTab, IndentWhenTab);
        this.addFeature(featureSet.outdentWhenShiftTab, OutdentWhenShiftTab);
        this.addFeature(
            featureSet.outdentWhenBackspaceOnEmptyFirstLine,
            OutdentWhenBackOn1stEmptyLine
        );
        this.addFeature(featureSet.outdentWhenEnterOnEmptyLine, OutdentWhenEnterOnEmptyLine);
        this.addFeature(featureSet.mergeInNewLineWhenBackspaceOnFirstChar, MergeInNewLine);
        this.addFeature(
            featureSet.unquoteWhenBackspaceOnEmptyFirstLine,
            UnquoteWhenBackOnEmpty1stLine
        );
        this.addFeature(featureSet.unquoteWhenEnterOnEmptyLine, UnquoteWhenEnterOnEmptyLine);
        this.addFeature(featureSet.tabInTable, TabInTable);
        this.addFeature(featureSet.upDownInTable, UpDownInTable);
        this.addFeature(featureSet.autoBullet, AutoBullet);
        this.addFeature(featureSet.autoLink, AutoLink);
        this.addFeature(featureSet.defaultShortcut, DefaultShortcut);
        this.autoLinkEnabled = featureSet.autoLink;
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor = null;
    }

    /**
     * Check whether the event should be handled exclusively by this plugin
     */
    public willHandleEventExclusively(event: PluginEvent): boolean {
        let e = (event as PluginDomEvent).rawEvent as KeyboardEvent;
        if (event.eventType == PluginEventType.KeyDown && this.keys.indexOf(e.which) >= 0) {
            let hasFunctionKey = e.ctrlKey || e.altKey || e.metaKey;
            for (let feature of this.features) {
                if (
                    (feature.allowFunctionKeys || !hasFunctionKey) &&
                    feature.keys.indexOf(e.which) >= 0 &&
                    feature.shouldHandleEvent(<PluginDomEvent>event, this.editor)
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
        if (event.eventType == PluginEventType.KeyDown && this.currentFeature) {
            let feature = this.currentFeature;
            this.currentFeature = null;
            feature.handleEvent(<PluginDomEvent>event, this.editor);
        } else if (
            event.eventType == PluginEventType.ContentChanged &&
            (<ContentChangedEvent>event).source == ChangeSource.Paste &&
            this.autoLinkEnabled &&
            AutoLink.shouldHandleEvent(event, this.editor)
        ) {
            AutoLink.handleEvent(event, this.editor);
        }
    }

    private addFeature(add: boolean, feature: ContentEditFeature) {
        if (add) {
            this.features.push(feature);
            for (let key of feature.keys) {
                if (this.keys.indexOf(key) < 0) {
                    this.keys.push(key);
                }
            }
        }
    }
}
