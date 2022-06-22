import * as ReactDOM from 'react-dom';
import EmojiPane, { EmojiPaneMode } from '../components/EmojiPane';
import showEmojiCallout from '../components/showEmojiCallout';
import { AriaAttributes } from '../type/AriaAttributes';
import { Editor } from 'roosterjs-editor-core';
import { Emoji } from '../type/Emoji';
import { EmojiStyle } from '../type/EmojiStyle';
import { KeyCodes } from '@fluentui/react/lib/Utilities';
import { matchShortcut } from '../utils/searchEmojis';
import { MoreEmoji } from '../utils/emojiList';
import { ReactEditorPlugin, UIUtilities } from '../../common/index';
import { replaceWithNode } from 'roosterjs-editor-api';
import { Strings } from '../type/Strings';

import {
    ChangeSource,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

const EMOJI_SEARCH_DELAY = 300;
const INTERNAL_EMOJI_FONT_NAME = 'EmojiFont';
const EMOJI_FONT_LIST =
    "'Apple Color Emoji','Segoe UI Emoji', NotoColorEmoji,'Segoe UI Symbol','Android Emoji',EmojiSymbols";
const KEYCODE_COLON = 186;
const KEYCODE_COLON_FIREFOX = 59;

// Regex looks for an emoji right before the : to allow contextual search immediately following an emoji
// MATCHES: 0: 😃:r
//          1: 😃
//          2: :r

const EMOJI_BEFORE_COLON_REGEX = /([\u0023-\u0039][\u20e3]|[\ud800-\udbff][\udc00-\udfff]|[\u00a9-\u00ae]|[\u2122-\u3299])*([:;][^:]*)/;

/**
 * Interface to customize the emoji plugin
 */
export interface EmojiPluginOptions {
    strings?: {
        [key: string]: string;
    };
    calloutClassName?: string;
    emojiStyle?: EmojiStyle;
}

class EmojiPlugin implements ReactEditorPlugin {
    private editor: Editor;
    private contentDiv: HTMLDivElement;
    private eventHandledOnKeyDown: boolean;
    private canUndoEmoji: boolean;
    private isSuggesting: boolean;
    private contentEditable: HTMLDivElement;
    private pane: EmojiPane;
    private timer: number;
    private uiUtilities: UIUtilities | null = null;
    private strings: Strings;
    private refreshCalloutDebounced: () => void;

    constructor(private options: EmojiPluginOptions = {}) {
        this.strings = options.strings;
    }

    setUIUtilities(uiUtilities: UIUtilities) {
        this.uiUtilities = uiUtilities;
    }

    willHandleEventExclusively?: (event: PluginEvent) => boolean;

    public getName() {
        return 'Emoji';
    }

    public dispose() {
        this.setIsSuggesting(false);
        if (this.contentDiv) {
            ReactDOM.unmountComponentAtNode(this.contentDiv);
            this.contentDiv.parentElement.removeChild(this.contentDiv);
            this.contentDiv = null;
        }
        this.editor = null;
    }

    public initialize(editor: Editor): void {
        this.editor = editor;
        const document = editor.getDocument();
        this.contentDiv = document.createElement('div');
        document.body.appendChild(this.contentDiv);
    }

    public initializeContentEditable(contentEditable: HTMLDivElement): void {
        this.contentEditable = contentEditable;
    }

    public startEmoji(startingString: string = ':'): void {
        if (this.editor) {
            return;
        }

        this.setIsSuggesting(true);
        this.editor.insertContent(startingString);
        this.triggerChangeEvent();
    }

    public onPluginEvent(event: PluginEvent): void {
        const domEvent = event as PluginDomEvent;
        const keyboardEvent = domEvent.rawEvent as KeyboardEvent;
        if (event.eventType === PluginEventType.KeyDown) {
            this.eventHandledOnKeyDown = false;
            if (this.isSuggesting) {
                this.onKeyDownSuggestingDomEvent(domEvent);
            } else if (keyboardEvent.which === KeyCodes.backspace && this.canUndoEmoji) {
                // If KeyDown is backspace and canUndoEmoji, call editor undo
                this.editor.undo();
                this.handleEventOnKeyDown(domEvent);
                this.canUndoEmoji = false;
            }
        } else if (
            event.eventType === PluginEventType.KeyUp &&
            !this.isModifierKey(keyboardEvent.key)
        ) {
            if (this.isSuggesting) {
                this.onKeyUpSuggestingDomEvent(domEvent);
            } else {
                this.onKeyUpDomEvent(domEvent);
            }
        } else if (event.eventType === PluginEventType.MouseUp) {
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
    private onKeyDownSuggestingDomEvent(event: PluginDomEvent): void {
        // If key is enter, try insert emoji at selection
        // If key is space and selection is shortcut, try insert emoji
        const keyboardEvent = event.rawEvent as KeyboardEvent;
        const selectedEmoji = this.pane.getSelectedEmoji();
        const wordBeforeCursor = this.getWordBeforeCursor(event);

        let emoji: Emoji;
        switch (keyboardEvent.which) {
            case KeyCodes.space:
                // We only want to insert on space if the word before the cursor is a shortcut
                emoji = wordBeforeCursor ? matchShortcut(wordBeforeCursor) : null;
                if (!emoji) {
                    this.setIsSuggesting(false);
                }

                break;
            case KeyCodes.enter:
                // check if selection is on the "..." and show full picker if so, otherwise try to apply emoji
                if (this.tryShowFullPicker(event, selectedEmoji, wordBeforeCursor)) {
                    break;
                }

                // We only want to insert on space if the word before the cursor is a shortcut
                // If the timer is not null, that means we have a search queued.
                // Check to see is the word before the cursor matches a shortcut first
                // Otherwise if the search completed and it is a shortcut, insert the first item
                emoji = this.timer ? matchShortcut(wordBeforeCursor) : selectedEmoji;
                break;
            case KeyCodes.left:
            case KeyCodes.right:
                const nextIndex = this.pane.navigate(
                    keyboardEvent.which === KeyCodes.left ? -1 : 1
                );
                if (nextIndex >= 0) {
                    this.contentEditable.setAttribute(
                        AriaAttributes.ActiveDescendant,
                        this.pane.getEmojiElementIdByIndex(nextIndex)
                    );
                }
                this.handleEventOnKeyDown(event);
                break;
            case KeyCodes.escape:
                this.setIsSuggesting(false);
                this.handleEventOnKeyDown(event);
        }

        if (emoji && (this.canUndoEmoji = this.insertEmoji(emoji, wordBeforeCursor))) {
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
        this.pane.showFullPicker(wordBeforeCursor);
        return true;
    }

    /**
     * On KeyUp suggesting DOM event
     * If key is character, update search term
     * Otherwise set isSuggesting to false
     */
    private onKeyUpSuggestingDomEvent(event: PluginDomEvent): void {
        if (this.eventHandledOnKeyDown) {
            return;
        }

        const keyboardEvent = event.rawEvent as KeyboardEvent;

        // If this is a character key or backspace
        // Clear the timer as we will either queue a new timer or stop suggesting
        if (
            (keyboardEvent.key.length === 1 && keyboardEvent.which !== KeyCodes.space) ||
            keyboardEvent.which === KeyCodes.backspace
        ) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }

        const wordBeforeCursor = this.getWordBeforeCursor(event);
        if (wordBeforeCursor) {
            this.timer = window.setTimeout(() => {
                if (this.pane) {
                    this.pane.setSearch(wordBeforeCursor);
                    this.timer = null;
                }
            }, EMOJI_SEARCH_DELAY);
        } else {
            this.setIsSuggesting(false);
        }
    }

    private onKeyUpDomEvent(event: PluginDomEvent): void {
        if (this.eventHandledOnKeyDown) {
            return;
        }

        const keyboardEvent = event.rawEvent as KeyboardEvent;
        const wordBeforeCursor = this.getWordBeforeCursor(event);
        if (
            (keyboardEvent.which === KEYCODE_COLON ||
                keyboardEvent.which === KEYCODE_COLON_FIREFOX) &&
            wordBeforeCursor === ':'
        ) {
            this.setIsSuggesting(true);
        } else if (wordBeforeCursor) {
            const cursorData = this.editor.getContentSearcherOfCursor(event);
            const charBeforeCursor = cursorData ? cursorData.getSubStringBefore(1) : null;

            // It is possible that the word before the cursor is ahead of the pluginEvent we are handling
            // ex. WordBeforeCursor is ":D"" but the event we are currently handling is for the : key
            // Check that the char before the cursor is actually the key event we are currently handling
            // Otherwise we set canUndoEmoji to early and user is unable to backspace undo on the inserted emoji
            if (keyboardEvent.key === charBeforeCursor) {
                const emoji = matchShortcut(wordBeforeCursor);
                if (emoji && this.insertEmoji(emoji, wordBeforeCursor)) {
                    this.canUndoEmoji = true;
                }
            }
        }
    }

    private paneRef = (ref: EmojiPane): void => {
        this.pane = ref;
    };

    private getCallout() {
        const { calloutClassName, emojiStyle } = this.options;
        const rangeNode = this.editor.getElementAtCursor();
        const rect = rangeNode.getBoundingClientRect();
        showEmojiCallout(
            this.uiUtilities,
            calloutClassName,
            rect,
            this.strings,
            this.onSelectFromPane,
            this.refreshCalloutDebounced,
            this.onModeChanged,
            this.paneRef,
            this.onHideCallout,
            emojiStyle
        );
    }

    private onHideCallout = () => this.setIsSuggesting(false);

    private onSelectFromPane = (emoji: Emoji, wordBeforeCursor: string): void => {
        if (emoji === MoreEmoji) {
            this.pane.showFullPicker(wordBeforeCursor);
            return;
        }

        this.insertEmoji(emoji, wordBeforeCursor);
    };

    private onModeChanged = (newMode: EmojiPaneMode): void => {
        if (newMode !== EmojiPaneMode.Quick) {
            this.removeAutoCompleteAriaAttributes();
        }
    };

    private setIsSuggesting(isSuggesting: boolean): void {
        if (this.isSuggesting === isSuggesting) {
            return;
        }

        this.isSuggesting = isSuggesting;
        if (this.isSuggesting) {
            this.getCallout();
            // we need to delay so NVDA will announce the first selection
            setTimeout(() => {
                const { contentEditable } = this;
                if (contentEditable) {
                    contentEditable.setAttribute(AriaAttributes.AutoComplete, 'list');
                    contentEditable.setAttribute(AriaAttributes.Owns, this.pane.getListId);
                    contentEditable.setAttribute(
                        AriaAttributes.ActiveDescendant,
                        this.pane.getEmojiElementIdByIndex(0)
                    );
                }
            }, 0);
        } else {
            ReactDOM.unmountComponentAtNode(this.contentDiv);

            this.removeAutoCompleteAriaAttributes();
        }
    }

    private removeAutoCompleteAriaAttributes(): void {
        const { contentEditable } = this;
        if (contentEditable) {
            contentEditable.removeAttribute(AriaAttributes.AutoComplete);
            contentEditable.removeAttribute(AriaAttributes.Owns);
            contentEditable.removeAttribute(AriaAttributes.ActiveDescendant);
        }
    }

    private insertEmoji(emoji: Emoji, wordBeforeCursor: string): boolean {
        let inserted = false;
        this.editor.addUndoSnapshot();

        const node = this.editor.getDocument().createElement('span');
        node.innerText = emoji.codePoint;
        if (
            wordBeforeCursor &&
            replaceWithNode(this.editor, wordBeforeCursor, node, false /*exactMatch*/)
        ) {
            inserted = true;
            this.canUndoEmoji = true;

            // Update the editor cursor to be after the inserted node
            window.requestAnimationFrame(() => {
                if (this.editor && this.editor.contains(node)) {
                    this.editor.select(node, PositionType.After);
                    this.editor.addUndoSnapshot();
                }
            });
        } else {
            inserted = this.editor.insertNode(node);
        }

        if (inserted) {
            this.triggerChangeEvent();
        }

        this.tryPatchEmojiFont();

        return inserted;
    }

    private tryPatchEmojiFont(): boolean {
        // This is not perfect way of doing this, but cannot find a better way.
        // Essentially what is happening is, emoji requires some special font to render properly. Without those font, it may render black and white
        // The fix we have right now is to find the topest block element and patch it with emoji font
        const range = this.editor.getSelectionRange();
        const inlineElement = range
            ? this.editor.getContentSearcherOfCursor().getInlineElementAfter()
            : null;
        const blockElement = inlineElement ? inlineElement.getParentBlock() : null;
        if (blockElement) {
            const blockNode = blockElement.getStartNode() as HTMLElement;
            const fontFamily = blockNode.style.fontFamily;
            if (fontFamily && fontFamily.toLowerCase().indexOf('emoji') < 0) {
                blockNode.style.fontFamily =
                    fontFamily + ',' + INTERNAL_EMOJI_FONT_NAME + ',' + EMOJI_FONT_LIST;
                return true;
            }
        }

        return false;
    }

    private getWordBeforeCursor(event: PluginEvent): string {
        const cursorData = this.editor.getContentSearcherOfCursor(event);
        const wordBeforeCursor = cursorData ? cursorData.getWordBefore() : null;
        const matches = EMOJI_BEFORE_COLON_REGEX.exec(wordBeforeCursor);
        return matches && matches.length > 2 && matches[0] === wordBeforeCursor ? matches[2] : null;
    }

    private triggerChangeEvent(): void {
        this.editor.triggerContentChangedEvent(ChangeSource.SetContent);
    }

    private isModifierKey(key: string): boolean {
        return key === 'Shift' || key === 'Control' || key === 'Alt' || key === 'Command';
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
export default function createEmojiPlugin(options: EmojiPluginOptions): ReactEditorPlugin {
    return new EmojiPlugin(options);
}
