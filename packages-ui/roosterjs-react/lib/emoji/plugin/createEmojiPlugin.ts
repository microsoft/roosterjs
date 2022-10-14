import showEmojiCallout, { EmojiICallout } from '../components/showEmojiCallout';
import { Emoji } from '../type/Emoji';
import { EmojiPane } from '../components/EmojiPane';
import { EmojiStringKeys } from '../type/EmojiStringKeys';
import { isModifierKey } from 'roosterjs-editor-dom';
import { KeyCodes } from '@fluentui/react/lib/Utilities';
import { LocalizedStrings, ReactEditorPlugin, UIUtilities } from '../../common/index';
import { MoreEmoji } from '../utils/emojiList';
import { replaceWithNode } from 'roosterjs-editor-api';
import {
    IEditor,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    PluginKeyboardEvent,
    PluginKeyDownEvent,
    PositionType,
} from 'roosterjs-editor-types';
import {
    EmojiDescriptionStrings,
    EmojiFamilyStrings,
    EmojiKeywordStrings,
} from '../type/EmojiStrings';
import * as React from 'react';

const KEYCODE_COLON = 186;
const KEYCODE_COLON_FIREFOX = 59;

// Regex looks for an emoji right before the : to allow contextual search immediately following an emoji
// MATCHES: 0: 😃:r
//          1: 😃
//          2: :r

const EMOJI_BEFORE_COLON_REGEX = /([\u0023-\u0039][\u20e3]|[\ud800-\udbff][\udc00-\udfff]|[\u00a9-\u00ae]|[\u2122-\u3299])*([:;][^:]*)/;

class EmojiPlugin implements ReactEditorPlugin {
    private editor: IEditor | null = null;
    private eventHandledOnKeyDown: boolean = false;
    private canUndoEmoji: boolean = false;
    private isSuggesting: boolean = false;
    private paneRef = React.createRef<EmojiPane>();
    private timer: number | null = null;
    private uiUtilities: UIUtilities | null = null;
    private strings: Record<string, string>;
    private emojiCalloutRef = React.createRef<EmojiICallout>();
    private baseId = 0;

    constructor(private searchBoxStrings?: LocalizedStrings<EmojiStringKeys>) {
        this.strings = {
            ...EmojiDescriptionStrings,
            ...EmojiKeywordStrings,
            ...EmojiFamilyStrings,
        };
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }

    public getName() {
        return 'Emoji';
    }

    public dispose() {
        this.setIsSuggesting(false);
        this.emojiCalloutRef.current?.dismiss();
        this.editor = null;
        this.baseId = 0;
    }

    public initialize(editor: IEditor): void {
        this.editor = editor;
    }

    public onPluginEvent(event: PluginEvent): void {
        if (event.eventType === PluginEventType.KeyDown) {
            this.eventHandledOnKeyDown = false;
            if (this.isSuggesting) {
                this.onKeyDownSuggestingDomEvent(event);
            } else if (event.rawEvent.which === KeyCodes.backspace && this.canUndoEmoji) {
                //TODO: 1051
                // If KeyDown is backspace and canUndoEmoji, call editor undo
                this.editor!.undo();
                this.handleEventOnKeyDown(event);
                this.canUndoEmoji = false;
            }
        } else if (event.eventType === PluginEventType.KeyUp && !isModifierKey(event.rawEvent)) {
            if (this.isSuggesting) {
                this.onKeyUpSuggestingDomEvent(event);
            } else {
                this.onKeyUpDomEvent(event);
            }
        } else if (event.eventType === PluginEventType.MouseUp) {
            //TODO: 1052
            // If MouseUp, the emoji cannot be undone
            this.canUndoEmoji = false;
            this.setIsSuggesting(false);
        }
    }

    /**
     * On KeyDown suggesting DOM event
     * Try to insert emoji is possible
     * Intercept arrow keys to move selection if popup is shown
     */
    private onKeyDownSuggestingDomEvent(event: PluginKeyDownEvent): void {
        // If key is enter, try insert emoji at selection
        // If key is space and selection is shortcut, try insert emoji

        const wordBeforeCursor = this.getWordBeforeCursor(event);
        switch (event.rawEvent.which) {
            case KeyCodes.enter:
                const selectedEmoji = this.paneRef.current?.getSelectedEmoji();
                // check if selection is on the "..." and show full picker if so, otherwise try to apply emoji
                if (
                    !selectedEmoji ||
                    !wordBeforeCursor ||
                    this.tryShowFullPicker(event, selectedEmoji, wordBeforeCursor)
                ) {
                    break;
                } else {
                    this.insertEmoji(selectedEmoji, wordBeforeCursor);
                    this.handleEventOnKeyDown(event);
                }

                break;
            case KeyCodes.left:
            case KeyCodes.right:
                this.paneRef.current?.navigate(event.rawEvent.which === KeyCodes.left ? -1 : 1);
                this.handleEventOnKeyDown(event);
                break;
            case KeyCodes.escape:
                this.setIsSuggesting(false);
                this.handleEventOnKeyDown(event);
        }
    }

    private tryShowFullPicker(
        event: PluginDomEvent,
        selectedEmoji: Emoji,
        wordBeforeCursor: string
    ): boolean {
        if (selectedEmoji !== MoreEmoji) {
            return false;
        }

        this.handleEventOnKeyDown(event);
        this.paneRef.current?.showFullPicker(wordBeforeCursor);
        return true;
    }

    /**
     * On KeyUp suggesting DOM event
     * If key is character, update search term
     * Otherwise set isSuggesting to false
     */
    private onKeyUpSuggestingDomEvent(event: PluginKeyboardEvent): void {
        if (this.eventHandledOnKeyDown) {
            return;
        }
        // If this is a character key or backspace
        // Clear the timer as we will either queue a new timer or stop suggesting
        if (
            this.timer &&
            ((event.rawEvent.key.length === 1 && event.rawEvent.which !== KeyCodes.space) ||
                event.rawEvent.which === KeyCodes.backspace)
        ) {
            this.editor?.getDocument().defaultView?.clearTimeout(this.timer);
            this.timer = null;
            this.emojiCalloutRef.current?.dismiss();
        }

        const wordBeforeCursor = this.getWordBeforeCursor(event);
        if (wordBeforeCursor) {
            if (this.paneRef) {
                this.paneRef.current?.setSearch(wordBeforeCursor);
            } else {
                this.setIsSuggesting(false);
            }
        } else {
            this.setIsSuggesting(false);
        }
    }

    private onKeyUpDomEvent(event: PluginKeyboardEvent): void {
        if (this.eventHandledOnKeyDown) {
            return;
        }
        const wordBeforeCursor = this.getWordBeforeCursor(event);
        if (
            (event.rawEvent.which === KEYCODE_COLON ||
                event.rawEvent.which === KEYCODE_COLON_FIREFOX) &&
            wordBeforeCursor === ':'
        ) {
            this.setIsSuggesting(true);
        }
    }

    private getCallout() {
        const rangeNode = this.editor?.getElementAtCursor();
        const rect = rangeNode?.getBoundingClientRect();
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
        }
    }

    private onHideCallout = () => this.setIsSuggesting(false);

    private onSelectFromPane = (emoji: Emoji, wordBeforeCursor: string): void => {
        if (emoji === MoreEmoji) {
            this.paneRef.current?.showFullPicker(wordBeforeCursor);
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
            this.getCallout();
        } else if (this.emojiCalloutRef) {
            this.emojiCalloutRef.current?.dismiss();
        }
    }

    private insertEmoji(emoji: Emoji, wordBeforeCursor: string) {
        if (!wordBeforeCursor || !this.editor || !emoji.codePoint) {
            return;
        }
        const node = this.editor.getDocument().createElement('span');
        node.innerText = emoji.codePoint;

        this.editor.addUndoSnapshot(
            () => {
                if (this.editor) {
                    replaceWithNode(this.editor, wordBeforeCursor, node, true /*exactMatch*/);
                    this.editor.select(node, PositionType.After);
                }
            },
            undefined /*changeSource*/,
            true /*canUndoByBackspace*/
        );

        this.emojiCalloutRef.current?.dismiss();
    }

    private getWordBeforeCursor(event: PluginEvent): string | null {
        const cursorData = this.editor?.getContentSearcherOfCursor(event);
        const wordBeforeCursor = cursorData ? cursorData.getWordBefore() : null;
        const matches = wordBeforeCursor ? EMOJI_BEFORE_COLON_REGEX.exec(wordBeforeCursor) : null;
        return matches && matches.length > 2 && matches[0] === wordBeforeCursor ? matches[2] : null;
    }

    private handleEventOnKeyDown(event: PluginDomEvent): void {
        this.eventHandledOnKeyDown = true;
        event.rawEvent.preventDefault();
        event.rawEvent.stopImmediatePropagation();
    }
}

/**
 * Create a new instance of Emoji plugin with FluentUI components.
 */
export default function createEmojiPlugin(
    searchBoxStrings?: LocalizedStrings<EmojiStringKeys>
): ReactEditorPlugin {
    return new EmojiPlugin(searchBoxStrings);
}
