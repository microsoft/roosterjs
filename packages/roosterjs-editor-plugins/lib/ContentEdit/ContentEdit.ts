import ContentEditFeatures, { getDefaultContentEditFeatures } from './ContentEditFeatures';
import { AutoLink, UnlinkWhenBackspaceAfterLink } from './features/autoLinkFeatures';
import { DefaultShortcut } from './features/shortcutFeatures';
import { Editor, EditorPlugin, GenericContentEditFeature } from 'roosterjs-editor-core';
import { InsertLineBeforeStructuredNodeFeature } from './features/insertLineBeforeStructuredNodeFeature';
import { PluginEvent } from 'roosterjs-editor-types';
import { TabInTable, UpDownInTable } from './features/tableFeatures';

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

    /**
     * Create instance of ContentEdit plugin
     * @param features An optional feature set to determine which features the plugin should provide
     */
    constructor(private featureSet?: ContentEditFeatures) {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'ContentEdit';
    }

    /**
     * Initialize this plugin
     * @param editor The editor instance
     */
    public initialize(editor: Editor): void {
        this.editor = editor;
        this.getFilteredFeatures().forEach(feature => this.editor.addContentEditFeature(feature));
    }

    /**
     * Dispose this plugin
     */
    public dispose(): void {
        this.editor = null;
    }

    private getFilteredFeatures(): GenericContentEditFeature<PluginEvent>[] {
        let featureSet = this.featureSet || getDefaultContentEditFeatures();
        let allFeatures: {
            [key in keyof Partial<ContentEditFeatures>]: GenericContentEditFeature<PluginEvent>
        } = {
            indentWhenTab: IndentWhenTab,
            outdentWhenShiftTab: OutdentWhenShiftTab,
            outdentWhenBackspaceOnEmptyFirstLine: OutdentWhenBackOn1stEmptyLine,
            outdentWhenEnterOnEmptyLine: OutdentWhenEnterOnEmptyLine,
            mergeInNewLineWhenBackspaceOnFirstChar: MergeInNewLine,
            unquoteWhenBackspaceOnEmptyFirstLine: UnquoteWhenBackOnEmpty1stLine,
            unquoteWhenEnterOnEmptyLine: UnquoteWhenEnterOnEmptyLine,
            tabInTable: TabInTable,
            upDownInTable: UpDownInTable,
            insertLineBeforeStructuredNodeFeature: InsertLineBeforeStructuredNodeFeature,
            autoBullet: AutoBullet,
            autoLink: AutoLink,
            unlinkWhenBackspaceAfterLink: UnlinkWhenBackspaceAfterLink,
            defaultShortcut: DefaultShortcut,
            smartOrderedList: getSmartOrderedList(featureSet.smartOrderedListStyles),
        };
        let keys = Object.keys(allFeatures) as (keyof ContentEditFeatures)[];
        return keys.filter(key => featureSet[key]).map(key => allFeatures[key]);
    }
}
