import * as React from 'react';
import {
    createContentModelDocument,
    createParagraph,
    createSelectionMarker,
    createText,
    isNodeOfType,
} from 'roosterjs-content-model-dom';
import { PickerPlugin } from 'roosterjs-content-model-plugins';
import { MoreEmoji } from '../utils/emojiList';
import { showEmojiCallout } from '../components/showEmojiCallout';
import type { EmojiICallout } from '../components/showEmojiCallout';
import type { Emoji } from '../type/Emoji';
import type { EmojiPane } from '../components/EmojiPane';
import type { EmojiStringKeys } from '../type/EmojiStringKeys';
import type { LocalizedStrings, ReactEditorPlugin, UIUtilities } from '../../common/index';
import {
    EmojiDescriptionStrings,
    EmojiFamilyStrings,
    EmojiKeywordStrings,
} from '../type/EmojiStrings';
import type { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import type {
    PickerDirection,
    PickerHandler,
    PickerHelper,
    PickerSelectionChangMode,
} from 'roosterjs-content-model-plugins';

class EmojiPlugin implements ReactEditorPlugin, PickerHandler {
    private editor: IEditor | null = null;
    private isSuggesting: boolean = false;
    private paneRef = React.createRef<EmojiPane>();
    private uiUtilities: UIUtilities | null = null;
    private strings: Record<string, string>;
    private emojiCalloutRef = React.createRef<EmojiICallout>();
    private pickerPlugin: PickerPlugin;
    private pickerHelper: PickerHelper | null = null;
    private queryString: string = ':';
    private baseId = 0;

    constructor(private searchBoxStrings?: LocalizedStrings<EmojiStringKeys>) {
        this.strings = {
            ...EmojiDescriptionStrings,
            ...EmojiKeywordStrings,
            ...EmojiFamilyStrings,
        };
        this.pickerPlugin = new PickerPlugin(':', this);
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }

    public getName() {
        return 'Emoji';
    }

    public dispose() {
        this.pickerPlugin.dispose();
        this.baseId = 0;
        this.editor = null;
    }

    public initialize(editor: IEditor): void {
        this.editor = editor;
        this.pickerPlugin.initialize(editor);
    }

    public onPluginEvent(event: PluginEvent): void {
        this.pickerPlugin.onPluginEvent(event);
    }

    public willHandleEventExclusively(event: PluginEvent): boolean {
        return this.pickerPlugin.willHandleEventExclusively(event);
    }

    public onInitialize(helper: PickerHelper): void {
        this.pickerHelper = helper;
    }

    public onDispose(): void {
        this.setIsSuggesting(false);
        this.emojiCalloutRef.current?.dismiss();
        this.pickerHelper = null;
    }

    public onTrigger(queryString: string): PickerDirection | null {
        this.queryString = queryString;
        this.setIsSuggesting(true);
        this.paneRef.current?.setSearch(queryString);
        return this.isSuggesting ? 'both' : null;
    }

    public onClosePicker(): void {
        this.setIsSuggesting(false);
    }

    public onQueryStringChanged(queryString: string): void {
        this.queryString = queryString;
        this.paneRef.current?.setSearch(queryString);
    }

    public onSelect(): void {
        const selectedEmoji = this.paneRef.current?.getSelectedEmoji();
        const queryString = this.queryString;

        if (!selectedEmoji || !queryString || this.tryShowFullPicker(selectedEmoji, queryString)) {
            return;
        }

        this.insertEmoji(selectedEmoji, queryString);
    }

    public onSelectionChanged(mode: PickerSelectionChangMode): void {
        switch (mode) {
            case 'next':
                this.paneRef.current?.navigate(1);
                break;
            case 'previous':
                this.paneRef.current?.navigate(-1);
                break;
            case 'nextRow':
                this.paneRef.current?.navigate(1, 'Vertical');
                break;
            case 'previousRow':
                this.paneRef.current?.navigate(-1, 'Vertical');
                break;
        }
    }

    private getCallout(): boolean {
        const selection = this.editor?.getDOMSelection();
        const rangeNode = selection?.type == 'range' ? selection.range.startContainer : null;
        const rangeElement = isNodeOfType(rangeNode, 'ELEMENT_NODE')
            ? rangeNode
            : rangeNode?.parentElement;
        const rect = rangeElement?.getBoundingClientRect();

        if (this.uiUtilities && rect) {
            this.baseId++;

            showEmojiCallout(
                this.uiUtilities,
                rect,
                this.strings,
                this.onSelectFromPane,
                this.paneRef,
                this.emojiCalloutRef,
                this.onHideCallout,
                this.baseId,
                this.searchBoxStrings
            );

            return true;
        }

        return false;
    }

    private onHideCallout = () => this.pickerHelper?.closePicker();

    private onSelectFromPane = (emoji: Emoji, wordBeforeCursor: string): void => {
        this.queryString = wordBeforeCursor;

        if (this.tryShowFullPicker(emoji, wordBeforeCursor)) {
            return;
        }

        this.insertEmoji(emoji, wordBeforeCursor);
    };

    private setIsSuggesting(isSuggesting: boolean): void {
        if (this.isSuggesting === isSuggesting) {
            return;
        }

        this.isSuggesting = isSuggesting;
        if (this.isSuggesting) {
            if (!this.getCallout()) {
                this.isSuggesting = false;
            }
        } else if (this.emojiCalloutRef) {
            this.emojiCalloutRef.current?.dismiss();
        }
    }

    private tryShowFullPicker(selectedEmoji: Emoji, queryString: string): boolean {
        if (selectedEmoji !== MoreEmoji) {
            return false;
        }

        this.paneRef.current?.showFullPicker(queryString);
        return true;
    }

    private insertEmoji(emoji: Emoji, queryString: string) {
        if (!queryString || !emoji.codePoint || !this.pickerHelper) {
            return;
        }

        const model = createContentModelDocument();
        const paragraph = createParagraph();

        paragraph.segments.push(createText(emoji.codePoint), createSelectionMarker());
        model.blocks.push(paragraph);

        this.pickerHelper.replaceQueryString(model, undefined /*options*/, true /*canUndoByBackspace*/);
        this.pickerHelper.closePicker();
    }
}

/**
 * Create a new instance of Emoji plugin with FluentUI components.
 */
export function createEmojiPlugin(
    searchBoxStrings?: LocalizedStrings<EmojiStringKeys>
): ReactEditorPlugin {
    return new EmojiPlugin(searchBoxStrings);
}
