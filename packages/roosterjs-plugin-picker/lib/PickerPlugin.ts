import { PickerDataProvider, PickerPluginOptions } from './PickerDataProvider';
import { replaceWithNode } from 'roosterjs-editor-api';
import { Editor, EditorPlugin, cacheGetContentSearcher } from 'roosterjs-editor-core';
import { PartialInlineElement } from 'roosterjs-editor-dom';
import { PluginKeyboardEvent, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

// Character codes
export const BACKSPACE_CHARCODE = 8;
export const TAB_CHARCODE = 9;
export const ENTER_CHARCODE = 13;
export const ESC_CHARCODE = 27;
export const LEFT_ARROW_CHARCODE = 37;
export const UP_ARROW_CHARCODE = 38;
export const RIGHT_ARROW_CHARCODE = 39;
export const DOWN_ARROW_CHARCODE = 40;
export const DELETE_CHARCODE = 46;

export interface EditorPickerPluginInterface extends EditorPlugin {
    dataProvider: PickerDataProvider;
}

export default class EditorPickerPlugin implements EditorPickerPluginInterface {
    private editor: Editor;
    private eventHandledOnKeyDown: boolean;
    private blockSuggestions: boolean;
    private isSuggesting: boolean;

    constructor(
        public readonly dataProvider: PickerDataProvider,
        private pickerOptions: PickerPluginOptions
    ) {}

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

    public dispose() {
        this.editor = null;
        this.dataProvider.onDispose();
    }

    public willHandleEventExclusively(event: PluginEvent) {
        return (
            this.isSuggesting &&
            (event.eventType == PluginEventType.KeyDown || event.eventType == PluginEventType.KeyUp)
        );
    }

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
        let range = this.editor.getDocument().createRange();
        PositionContentSearcher.forEachTextInlineElement(textInline => {
            let hasMatched = false;
            let nodeContent = textInline.getTextContent();
            let nodeIndex = nodeContent ? nodeContent.length : -1;
            while (nodeIndex >= 0) {
                if (nodeContent[nodeIndex] == this.pickerOptions.triggerCharacter) {
                    range.setStart(
                        textInline.getContainerNode(),
                        textInline.getStartPoint().offset + nodeIndex
                    );
                    hasMatched = true;
                    break;
                }
                nodeIndex--;
            }

            if (hasMatched) {
                range.setEnd(textInline.getContainerNode(), textInline.getEndPoint().offset);
            }

            return hasMatched;
        });
        return range;
    }

    private onKeyUpDomEvent(event: PluginKeyboardEvent) {
        if (this.isSuggesting) {
            let wordBeforeCursor = this.getWord(event);
            if (wordBeforeCursor && wordBeforeCursor.split(' ').length <= 4) {
                let shortWord = wordBeforeCursor.substring(1).trim();
                this.dataProvider.queryStringUpdated(shortWord);
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
            if (keyboardEvent.which == ESC_CHARCODE) {
                this.setIsSuggesting(false);
                this.blockSuggestions = true;
                this.handleKeyDownEvent(event);
            } else if (
                this.dataProvider.shiftHighlight &&
                (this.pickerOptions.isHorizontal
                    ? keyboardEvent.which == LEFT_ARROW_CHARCODE ||
                      keyboardEvent.which == RIGHT_ARROW_CHARCODE
                    : keyboardEvent.which == UP_ARROW_CHARCODE ||
                      keyboardEvent.which == DOWN_ARROW_CHARCODE)
            ) {
                this.dataProvider.shiftHighlight(
                    this.pickerOptions.isHorizontal
                        ? keyboardEvent.which == RIGHT_ARROW_CHARCODE
                        : keyboardEvent.which == DOWN_ARROW_CHARCODE
                );
                this.handleKeyDownEvent(event);
            } else if (
                this.dataProvider.selectOption &&
                (keyboardEvent.which == ENTER_CHARCODE || keyboardEvent.which == TAB_CHARCODE)
            ) {
                this.dataProvider.selectOption();
                this.handleKeyDownEvent(event);
            } else {
                // Currently no op.
            }
        } else {
            if (keyboardEvent.which == BACKSPACE_CHARCODE) {
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
                    this.handleKeyDownEvent(event);
                }
            } else if (keyboardEvent.which == DELETE_CHARCODE) {
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
