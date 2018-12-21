import { Browser, createRange, PartialInlineElement } from 'roosterjs-editor-dom';
import { cacheGetContentSearcher, Editor, EditorPlugin } from 'roosterjs-editor-core';
import { PickerDataProvider, PickerPluginOptions } from './PickerDataProvider';
import { replaceWithNode } from 'roosterjs-editor-api';
import {
    NodePosition,
    PluginKeyboardEvent,
    PluginEvent,
    PluginEventType,
    PositionType,
} from 'roosterjs-editor-types';

// Character codes.
// IE11 uses different character codes. which are noted below.
// If adding a new key, test in IE to figure out what the code is.
export const BACKSPACE_CHARCODE = 'Backspace';
export const TAB_CHARCODE = 'Tab';
export const ENTER_CHARCODE = 'Enter';
export const ESC_CHARCODE = !Browser.isIE ? 'Escape' : 'Esc';
export const LEFT_ARROW_CHARCODE = !Browser.isIE ? 'ArrowLeft' : 'Left';
export const UP_ARROW_CHARCODE = !Browser.isIE ? 'ArrowUp' : 'Up';
export const RIGHT_ARROW_CHARCODE = !Browser.isIE ? 'ArrowRight' : 'Right';
export const DOWN_ARROW_CHARCODE = !Browser.isIE ? 'ArrowDown' : 'Down';
export const DELETE_CHARCODE = !Browser.isIE ? 'Delete' : 'Del';

export interface EditorPickerPluginInterface extends EditorPlugin {
    dataProvider: PickerDataProvider;
}

export default class PickerPlugin implements EditorPickerPluginInterface {
    private editor: Editor;
    private eventHandledOnKeyDown: boolean;
    private blockSuggestions: boolean;
    private isSuggesting: boolean;

    constructor(
        public readonly dataProvider: PickerDataProvider,
        private pickerOptions: PickerPluginOptions
    ) {}

    /**
     * Get a friendly name
     */
    getName() {
        return 'Picker';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    public initialize(editor: Editor) {
        this.editor = editor;
        this.dataProvider.onInitalize(
            (htmlNode: Node) => {
                let nodeInserted = false;
                this.editor.focus();
                this.editor.addUndoSnapshot();

                let wordToReplace = this.getWord(null);
                if (wordToReplace) {
                    replaceWithNode(this.editor, wordToReplace, htmlNode, true);
                    nodeInserted = true;
                    this.setIsSuggesting(false);
                }

                if (nodeInserted) {
                    this.editor.triggerContentChangedEvent(this.pickerOptions.changeSource);
                    this.editor.addUndoSnapshot();
                }
            },
            (isSuggesting: boolean) => {
                this.setIsSuggesting(isSuggesting);
            },
            editor
        );
    }

    /**
     * Dispose this plugin
     */
    public dispose() {
        this.editor = null;
        this.dataProvider.onDispose();
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    public willHandleEventExclusively(event: PluginEvent) {
        return (
            this.isSuggesting &&
            (event.eventType == PluginEventType.KeyDown || event.eventType == PluginEventType.KeyUp)
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        if (event.eventType == PluginEventType.KeyDown) {
            this.eventHandledOnKeyDown = false;
            this.onKeyDownEvent(event);
        }
        if (event.eventType == PluginEventType.KeyUp && !this.eventHandledOnKeyDown) {
            this.onKeyUpDomEvent(event);
        } else if (event.eventType == PluginEventType.MouseUp) {
            if (this.isSuggesting) {
                this.setIsSuggesting(false);
            }
        }
    }

    private setIsSuggesting(isSuggesting: boolean) {
        this.isSuggesting = isSuggesting;
        this.dataProvider.onIsSuggestingChanged(isSuggesting);
    }

    private handleKeyDownEvent(event: PluginKeyboardEvent) {
        this.eventHandledOnKeyDown = true;
        event.rawEvent.preventDefault();
        event.rawEvent.stopImmediatePropagation();
    }

    private getIdValue(node: Node): string {
        let element = node as Element;
        return element.attributes && element.attributes.getNamedItem('id')
            ? (element.attributes.getNamedItem('id').value as string)
            : null;
    }

    private getWordBeforeCursor(event: PluginKeyboardEvent): string {
        let searcher = cacheGetContentSearcher(event, this.editor);
        return searcher ? searcher.getWordBefore() : null;
    }

    private replaceNode(currentNode: Node, replacementNode: Node) {
        if (currentNode) {
            this.editor.deleteNode(currentNode);
        }
        if (replacementNode) {
            this.editor.insertNode(replacementNode);
        }
    }

    private getRangeUntilAt(event: PluginKeyboardEvent): Range {
        let PositionContentSearcher = cacheGetContentSearcher(event, this.editor);
        let startPos: NodePosition;
        let endPos: NodePosition;
        PositionContentSearcher.forEachTextInlineElement(textInline => {
            let hasMatched = false;
            let nodeContent = textInline.getTextContent();
            let nodeIndex = nodeContent ? nodeContent.length : -1;
            while (nodeIndex >= 0) {
                if (nodeContent[nodeIndex] == this.pickerOptions.triggerCharacter) {
                    startPos = textInline.getStartPosition().move(nodeIndex);
                    hasMatched = true;
                    break;
                }
                nodeIndex--;
            }

            if (hasMatched) {
                endPos = textInline.getEndPosition();
            }

            return hasMatched;
        });
        return createRange(startPos, endPos) || this.editor.getDocument().createRange();
    }

    private onKeyUpDomEvent(event: PluginKeyboardEvent) {
        if (this.isSuggesting) {
            // Word before cursor represents the text prior to the cursor, up to and including the trigger symbol.
            const wordBeforeCursor = this.getWord(event);
            const trimmedWordBeforeCursor = wordBeforeCursor.substring(1).trim();

            // If we hit a case where wordBeforeCursor is just the trigger character,
            // that means we've gotten a onKeyUp event right after it's been typed.
            // Otherwise, update the query string when:
            // 1. There's an actual value
            // 2. That actual value isn't just pure whitespace
            // 3. That actual value isn't more than 4 words long (at which point we assume the person kept typing)
            // Otherwise, we want to dismiss the picker plugin's UX.
            if (
                wordBeforeCursor == this.pickerOptions.triggerCharacter ||
                (trimmedWordBeforeCursor &&
                    trimmedWordBeforeCursor.length > 0 &&
                    trimmedWordBeforeCursor.split(' ').length <= 4)
            ) {
                this.dataProvider.queryStringUpdated(trimmedWordBeforeCursor);
            } else {
                this.setIsSuggesting(false);
            }
        } else {
            let wordBeforeCursor = this.getWordBeforeCursor(event);
            if (!this.blockSuggestions) {
                if (
                    wordBeforeCursor != null &&
                    wordBeforeCursor.split(' ').length <= 4 &&
                    wordBeforeCursor[0] == this.pickerOptions.triggerCharacter
                ) {
                    this.setIsSuggesting(true);
                    let shortWord = wordBeforeCursor.substring(1).trim();
                    this.dataProvider.queryStringUpdated(shortWord);
                    if (this.dataProvider.setCursorPoint) {
                        // Determine the bounding rectangle for the @mention
                        let searcher = cacheGetContentSearcher(event, this.editor);
                        let rangeNode = this.editor.getDocument().createRange();
                        let nodeBeforeCursor = searcher.getInlineElementBefore().getContainerNode();
                        let rangeStartSuccessfullySet = this.setRangeStart(
                            rangeNode,
                            nodeBeforeCursor,
                            wordBeforeCursor
                        );
                        if (!rangeStartSuccessfullySet) {
                            // VSO 24891: Out of range error is occurring because nodeBeforeCursor
                            // is not including the trigger character. In this case, the node before
                            // the node before cursor is the trigger character, and this is where the range should start.
                            let nodeBeforeNodeBeforeCursor = nodeBeforeCursor.previousSibling;
                            this.setRangeStart(
                                rangeNode,
                                nodeBeforeNodeBeforeCursor,
                                this.pickerOptions.triggerCharacter
                            );
                        }
                        let rect = rangeNode.getBoundingClientRect();

                        // Safari's support for range.getBoundingClientRect is incomplete.
                        // We perform this check to fall back to getClientRects in case it's at the page origin.
                        if (rect.left == 0 && rect.bottom == 0 && rect.top == 0) {
                            rect = rangeNode.getClientRects()[0];
                        }

                        if (!rect) {
                            return;
                        }
                        rangeNode.detach();

                        // Display the @mention popup in the correct place
                        let targetPoint = { x: rect.left, y: (rect.bottom + rect.top) / 2 };
                        let bufferZone = (rect.bottom - rect.top) / 2;
                        this.dataProvider.setCursorPoint(targetPoint, bufferZone);
                    }
                }
            } else {
                if (
                    wordBeforeCursor != null &&
                    wordBeforeCursor[0] != this.pickerOptions.triggerCharacter
                ) {
                    this.blockSuggestions = false;
                }
            }
        }
    }

    private onKeyDownEvent(event: PluginKeyboardEvent) {
        let keyboardEvent = event.rawEvent;
        if (this.isSuggesting) {
            if (keyboardEvent.key == ESC_CHARCODE) {
                this.setIsSuggesting(false);
                this.blockSuggestions = true;
                this.handleKeyDownEvent(event);
            } else if (
                this.dataProvider.shiftHighlight &&
                (this.pickerOptions.isHorizontal
                    ? keyboardEvent.key == LEFT_ARROW_CHARCODE ||
                      keyboardEvent.key == RIGHT_ARROW_CHARCODE
                    : keyboardEvent.key == UP_ARROW_CHARCODE ||
                      keyboardEvent.key == DOWN_ARROW_CHARCODE)
            ) {
                this.dataProvider.shiftHighlight(
                    this.pickerOptions.isHorizontal
                        ? keyboardEvent.key == RIGHT_ARROW_CHARCODE
                        : keyboardEvent.key == DOWN_ARROW_CHARCODE
                );
                this.handleKeyDownEvent(event);
            } else if (
                this.dataProvider.selectOption &&
                (keyboardEvent.key == ENTER_CHARCODE || keyboardEvent.key == TAB_CHARCODE)
            ) {
                this.dataProvider.selectOption();
                this.handleKeyDownEvent(event);
            } else {
                // Currently no op.
            }
        } else {
            if (keyboardEvent.key == BACKSPACE_CHARCODE) {
                let searcher = cacheGetContentSearcher(event, this.editor);
                let nodeBeforeCursor = searcher.getInlineElementBefore()
                    ? searcher.getInlineElementBefore().getContainerNode()
                    : null;
                let nodeId = nodeBeforeCursor ? this.getIdValue(nodeBeforeCursor) : null;
                if (
                    nodeId &&
                    nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0 &&
                    (searcher.getInlineElementAfter() == null ||
                        !(searcher.getInlineElementAfter() instanceof PartialInlineElement))
                ) {
                    let replacementNode = this.dataProvider.onRemove(nodeBeforeCursor, true);
                    this.replaceNode(nodeBeforeCursor, replacementNode);
                    this.editor.select(replacementNode, PositionType.After);
                    this.handleKeyDownEvent(event);
                }
            } else if (keyboardEvent.key == DELETE_CHARCODE) {
                let searcher = cacheGetContentSearcher(event, this.editor);
                let nodeAfterCursor = searcher.getInlineElementAfter()
                    ? searcher.getInlineElementAfter().getContainerNode()
                    : null;
                let nodeId = nodeAfterCursor ? this.getIdValue(nodeAfterCursor) : null;
                if (nodeId && nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0) {
                    let replacementNode = this.dataProvider.onRemove(nodeAfterCursor, false);
                    this.replaceNode(nodeAfterCursor, replacementNode);
                    this.handleKeyDownEvent(event);
                }
            }
        }
    }

    private getWord(event: PluginKeyboardEvent) {
        let wordFromRange = this.getRangeUntilAt(event).toString();
        let wordFromCache = this.getWordBeforeCursor(event);
        // VSO 24891: In picker, trigger and mention are separated into two nodes.
        // In this case, wordFromRange is the trigger character while wordFromCache is the whole string,
        // so wordFromCache is what we want to return.
        if (
            wordFromRange == this.pickerOptions.triggerCharacter &&
            wordFromRange != wordFromCache
        ) {
            return wordFromCache;
        }
        return wordFromRange;
    }

    private setRangeStart(rangeNode: Range, node: Node, target: string) {
        let nodeOffset = node ? node.textContent.lastIndexOf(target) : -1;
        if (nodeOffset > -1) {
            rangeNode.setStart(node, nodeOffset);
            return true;
        }
        return false;
    }
}
