import { AutoLink, UnlinkWhenBackspaceAfterLink } from './features/autoLinkFeatures';
import { DefaultShortcut } from './features/shortcutFeatures';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { TabInTable, UpDownInTable } from './features/tableFeatures';
import ContentEditFeatures, {
    getDefaultContentEditFeatures,
    GenericContentEditFeature,
    Keys,
} from './ContentEditFeatures';

import {
    AutoBullet,
    IndentWhenTab,
    OutdentWhenShiftTab,
    MergeInNewLine,
    OutdentWhenBackOn1stEmptyLine,
    OutdentWhenEnterOnEmptyLine,
    getSmartOrderedList,
} from './features/listFeatures';
import {
    UnquoteWhenBackOnEmpty1stLine,
    UnquoteWhenEnterOnEmptyLine,
} from './features/quoteFeatures';

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
    private featureMap: { [key: number]: GenericContentEditFeature<PluginEvent>[] } = {};
    private currentFeature: GenericContentEditFeature<PluginEvent>;
    public name: 'ContentEdit';

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private featureSet?: ContentEditFeatures) {}

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
        let featureSet = this.featureSet || getDefaultContentEditFeatures();
        [
            IndentWhenTab,
            OutdentWhenShiftTab,
            OutdentWhenBackOn1stEmptyLine,
            OutdentWhenEnterOnEmptyLine,
            MergeInNewLine,
            UnquoteWhenBackOnEmpty1stLine,
            UnquoteWhenEnterOnEmptyLine,
            TabInTable,
            UpDownInTable,
            AutoBullet,
            AutoLink,
            UnlinkWhenBackspaceAfterLink,
            DefaultShortcut,
            getSmartOrderedList(featureSet.smartOrderedListStyles),
        ]
            .filter(feature => featureSet[feature.featureFlag])
            .forEach(feature => {
                if (feature.initialize) {
                    feature.initialize(this.editor);
                }
                feature.keys.forEach(key => {
                    let array = this.featureMap[key] || [];
                    array.push(feature);
                    this.featureMap[key] = array;
                });
            });
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
        this.findFeature(event);
        return !!this.currentFeature;
    }

    /**
     * Handle the event
     */
    public onPluginEvent(event: PluginEvent) {
        // ContentChangedEvent will be broadcast so we won't see it in willHandleEventExclusively(),
        // we need to check it again here
        if (!this.currentFeature && event.eventType == PluginEventType.ContentChanged) {
            this.findFeature(event);
        }

        if (this.currentFeature) {
            let feature = this.currentFeature;
            this.currentFeature = null;
            feature.handleEvent(event, this.editor);
        }
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
