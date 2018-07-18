import { AutoLink } from './features/autoLinkFeatures';
import { DefaultShortcut } from './features/shortcutFeatures';
import { Editor, EditorPlugin } from 'roosterjs-editor-core';
import { TabInTable, UpDownInTable } from './features/tableFeatures';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';
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
    private features: GenericContentEditFeature<PluginEvent>[] = [];
    private contentChangedFeatures: GenericContentEditFeature<PluginEvent>[] = [];
    private keys: number[] = [];
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
        this.addFeature(
            featureSet.smartOrderedList,
            getSmartOrderedList(featureSet.smartOrderedListStyles)
        );
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
    public willHandleEventExclusively(e: PluginEvent): boolean {
        if (e.eventType == PluginEventType.KeyDown && this.keys.indexOf(e.rawEvent.which) >= 0) {
            let event = e.rawEvent;
            let hasFunctionKey = event.ctrlKey || event.altKey || event.metaKey;
            this.currentFeature = this.findFeature(this.features, hasFunctionKey, e);
            return !!this.currentFeature;
        }

        return false;
    }

    /**
     * Handle the event
     */
    public onPluginEvent(event: PluginEvent) {
        if (
            event.eventType == PluginEventType.ContentChanged &&
            !this.currentFeature &&
            this.contentChangedFeatures.length >= 0
        ) {
            this.currentFeature = this.findFeature(
                this.contentChangedFeatures,
                false /*hasFunctionKey*/,
                event
            );
        }

        if (this.currentFeature) {
            let feature = this.currentFeature;
            this.currentFeature = null;
            feature.handleEvent(event, this.editor);
        }
    }

    private findFeature(
        featureArray: GenericContentEditFeature<PluginEvent>[],
        hasFunctionKey: boolean,
        event: PluginEvent
    ): GenericContentEditFeature<PluginEvent> {
        let key =
            event.eventType == PluginEventType.KeyDown
                ? event.rawEvent.which
                : event.eventType == PluginEventType.ContentChanged
                    ? Keys.CONTENTCHANGED
                    : Keys.NULL;
        for (let feature of featureArray) {
            if (
                (feature.allowFunctionKeys || !hasFunctionKey) &&
                feature.keys.indexOf(key) >= 0 &&
                feature.shouldHandleEvent(event, this.editor)
            ) {
                return feature;
            }
        }
        return null;
    }

    private addFeature(add: boolean, feature: GenericContentEditFeature<PluginEvent>) {
        if (add) {
            this.features.push(feature);
            if (feature.initialize) {
                feature.initialize(this.editor);
            }

            let pushedIntoContentChangedFeatures = false;
            for (let key of feature.keys) {
                if (this.keys.indexOf(key) < 0) {
                    this.keys.push(key);
                }
                if (!pushedIntoContentChangedFeatures && key == Keys.CONTENTCHANGED) {
                    this.contentChangedFeatures.push(feature);
                    pushedIntoContentChangedFeatures = true;
                }
            }
        }
    }
}
