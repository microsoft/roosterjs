import { replaceWithNode } from 'roosterjs-editor-api';
import {
    Browser,
    createRange,
    isCharacterValue,
    isModifierKey,
    PartialInlineElement,
    safeInstanceOf,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    EditorPlugin,
    IEditor,
    NodePosition,
    PickerDataProvider,
    PickerPluginOptions,
    PluginDomEvent,
    PluginEvent,
    PluginEventType,
    PluginInputEvent,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';

// Character codes.
// IE11 uses different character codes. which are noted below.
// If adding a new key, test in IE to figure out what the code is.
const BACKSPACE_CHAR_CODE = 'Backspace';
const TAB_CHAR_CODE = 'Tab';
const ENTER_CHAR_CODE = 'Enter';
const ESC_CHAR_CODE = !Browser.isIE ? 'Escape' : 'Esc';
const LEFT_ARROW_CHAR_CODE = !Browser.isIE ? 'ArrowLeft' : 'Left';
const UP_ARROW_CHAR_CODE = !Browser.isIE ? 'ArrowUp' : 'Up';
const RIGHT_ARROW_CHAR_CODE = !Browser.isIE ? 'ArrowRight' : 'Right';
const DOWN_ARROW_CHAR_CODE = !Browser.isIE ? 'ArrowDown' : 'Down';
const DELETE_CHAR_CODE = !Browser.isIE ? 'Delete' : 'Del';

// Input event input types.
const DELETE_CONTENT_BACKWARDS_INPUT_TYPE = 'deleteContentBackwards';

// Unidentified key, the code for Android keyboard events.
const UNIDENTIFIED_KEY = 'Unidentified';
// the char code for Android keyboard events on Webview below 51.
const UNIDENTIFIED_CODE = [0, 229];

/**
 * PickerPlugin represents a plugin of editor which can handle picker related behaviors, including
 * - Show picker when special trigger key is pressed
 * - Hide picker
 * - Change selection in picker by Up/Down/Left/Right
 * - Apply selected item in picker
 *
 * PickerPlugin doesn't provide any UI, it just wraps related DOM events and invoke callback functions.
 */
export default class PickerPlugin<T extends PickerDataProvider = PickerDataProvider>
    implements EditorPlugin {
    private editor: IEditor | null = null;
    private eventHandledOnKeyDown: boolean = false;
    private blockSuggestions: boolean = false;
    private isSuggesting: boolean = false;
    private lastKnownRange: Range | null = null;

    // For detecting backspace in Android
    private isPendingInputEventHandling: boolean = false;
    private currentInputLength: number = 0;
    private newInputLength: number = 0;

    constructor(public readonly dataProvider: T, private pickerOptions: PickerPluginOptions) {}

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
    public initialize(editor: IEditor) {
        this.editor = editor;
        this.dataProvider.onInitalize(
            (htmlNode: Node) => {
                if (this.editor) {
                    this.editor.focus();

                    let wordToReplace = this.getWord(null);

                    // Safari drops our focus out so we get an empty word to replace when we call getWord.
                    // We fall back to using the lastKnownRange to try to get around this.
                    if ((!wordToReplace || wordToReplace.length == 0) && this.lastKnownRange) {
                        this.editor.select(this.lastKnownRange);
                        wordToReplace = this.getWord(null);
                    }

                    let insertNode = () => {
                        if (wordToReplace && this.editor) {
                            replaceWithNode(
                                this.editor,
                                wordToReplace,
                                htmlNode,
                                true /* exactMatch */
                            );
                        } else {
                            this.editor?.insertNode(htmlNode);
                        }
                        this.setIsSuggesting(false);
                    };

                    this.editor.addUndoSnapshot(
                        insertNode,
                        this.pickerOptions.changeSource,
                        this.pickerOptions.handleAutoComplete
                    );
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
        this.isSuggesting = false;
        this.blockSuggestions = false;
        this.eventHandledOnKeyDown = false;
        this.lastKnownRange = null;
        this.isPendingInputEventHandling = false;
        this.currentInputLength = 0;
        this.newInputLength = 0;
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
            (event.eventType == PluginEventType.KeyDown ||
                event.eventType == PluginEventType.KeyUp ||
                event.eventType == PluginEventType.Input)
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    public onPluginEvent(event: PluginEvent) {
        switch (event.eventType) {
            case PluginEventType.ContentChanged:
                if (event.source == ChangeSource.SetContent && this.dataProvider.onContentChanged) {
                    // Stop suggesting since content is fully changed
                    if (this.isSuggesting) {
                        this.setIsSuggesting(false);
                    }

                    // Undo and other major changes to document content fire this type of event.
                    // Inform the data provider of the current picker placed elements in the body.
                    let elementIds: string[] = [];
                    this.editor?.queryElements(
                        "[id^='" + this.pickerOptions.elementIdPrefix + "']",
                        element => {
                            if (element.id) {
                                elementIds.push(element.id);
                            }
                        }
                    );
                    this.dataProvider.onContentChanged(elementIds);
                }
                break;

            case PluginEventType.KeyDown:
                this.eventHandledOnKeyDown = false;
                if (this.isAndroidKeyboardEvent(event)) {
                    // On Android, the key for KeyboardEvent is "Unidentified" or undefined,
                    // so handling should be done using the input rather than key down event
                    // Since the key down event happens right before the input event, calculate the input
                    // length here in preparation for onAndroidInputEvent
                    this.currentInputLength = this.calcInputLength(event);
                    this.isPendingInputEventHandling = true;
                } else {
                    this.onKeyDownEvent(event);
                    this.isPendingInputEventHandling = false;
                }
                break;

            case PluginEventType.Input:
                if (this.isPendingInputEventHandling) {
                    this.onAndroidInputEvent(event);
                }
                break;

            case PluginEventType.KeyUp:
                if (!this.eventHandledOnKeyDown && this.shouldHandleKeyUpEvent(event)) {
                    this.onKeyUpDomEvent(event);
                    this.isPendingInputEventHandling = false;
                }
                break;

            case PluginEventType.MouseUp:
                if (this.isSuggesting) {
                    this.setIsSuggesting(false);
                }
                break;

            case PluginEventType.Scroll:
                if (this.dataProvider.onScroll) {
                    // Dispatch scroll event to data provider
                    this.dataProvider.onScroll(event.scrollContainer);
                }
                break;
        }
    }

    private setLastKnownRange(range: Range | null) {
        this.lastKnownRange = range;
    }

    private setIsSuggesting(isSuggesting: boolean) {
        this.isSuggesting = isSuggesting;

        if (!isSuggesting) {
            this.setLastKnownRange(null);
        }
        this.dataProvider.onIsSuggestingChanged(isSuggesting);

        this.setAriaOwns(isSuggesting);
        this.setAriaActiveDescendant(isSuggesting ? 0 : null);
    }

    private cancelDefaultKeyDownEvent(event: PluginKeyboardEvent) {
        this.eventHandledOnKeyDown = true;
        event.rawEvent.preventDefault();
        event.rawEvent.stopImmediatePropagation();
    }

    private getIdValue(node: Node): string | null {
        if (safeInstanceOf(node, 'HTMLElement')) {
            const attribute = node.attributes.getNamedItem('id');
            return attribute ? (attribute.value as string) : null;
        } else {
            return null;
        }
    }

    private getWordBeforeCursor(event: PluginKeyboardEvent | null): string | null {
        let searcher = this.editor?.getContentSearcherOfCursor(event);
        return searcher ? searcher.getWordBefore() : null;
    }

    private replaceNode(currentNode: Node | null, replacementNode: Node | null) {
        if (currentNode) {
            this.editor?.deleteNode(currentNode);
        }
        if (replacementNode) {
            this.editor?.insertNode(replacementNode);
        }
    }

    private getRangeUntilAt(event: PluginKeyboardEvent | null): Range | null {
        let positionContentSearcher = this.editor?.getContentSearcherOfCursor(event);
        let startPos: NodePosition | undefined = undefined;
        let endPos: NodePosition | undefined = undefined;
        positionContentSearcher?.forEachTextInlineElement(textInline => {
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
        return startPos
            ? createRange(startPos, endPos)
            : this.editor?.getDocument().createRange() ?? null;
    }

    private shouldHandleKeyUpEvent(event: PluginKeyboardEvent) {
        // onKeyUpDomEvent should only be called when a key that produces a character value is pressed
        // This check will always fail on Android since the KeyboardEvent's key is "Unidentified" or undefined
        // However, we don't need to check for modifier events on mobile, so can ignore this check
        return (
            this.isAndroidKeyboardEvent(event) ||
            isCharacterValue(event.rawEvent) ||
            (this.isSuggesting && !isModifierKey(event.rawEvent))
        );
    }

    private onKeyUpDomEvent(event: PluginKeyboardEvent) {
        if (this.editor) {
            if (this.isSuggesting) {
                // Word before cursor represents the text prior to the cursor, up to and including the trigger symbol.
                const wordBeforeCursor = this.getWord(event);
                if (wordBeforeCursor !== null) {
                    const wordBeforeCursorWithoutTriggerChar = wordBeforeCursor.substring(1);
                    const trimmedWordBeforeCursor = wordBeforeCursorWithoutTriggerChar.trim();

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
                        this.dataProvider.queryStringUpdated(
                            trimmedWordBeforeCursor,
                            wordBeforeCursorWithoutTriggerChar == trimmedWordBeforeCursor
                        );
                        this.setLastKnownRange(this.editor.getSelectionRange() ?? null);
                    } else {
                        this.setIsSuggesting(false);
                    }
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
                        const wordBeforeCursorWithoutTriggerChar = wordBeforeCursor.substring(1);
                        let trimmedWordBeforeCursor = wordBeforeCursorWithoutTriggerChar.trim();
                        this.dataProvider.queryStringUpdated(
                            trimmedWordBeforeCursor,
                            wordBeforeCursorWithoutTriggerChar == trimmedWordBeforeCursor
                        );
                        this.setLastKnownRange(this.editor.getSelectionRange() ?? null);
                        if (this.dataProvider.setCursorPoint) {
                            // Determine the bounding rectangle for the @mention
                            let searcher = this.editor.getContentSearcherOfCursor(event);
                            let rangeNode = this.editor.getDocument().createRange();

                            if (rangeNode) {
                                let nodeBeforeCursor =
                                    searcher?.getInlineElementBefore()?.getContainerNode() ?? null;

                                let rangeStartSuccessfullySet = this.setRangeStart(
                                    rangeNode,
                                    nodeBeforeCursor,
                                    wordBeforeCursor
                                );
                                if (!rangeStartSuccessfullySet) {
                                    // VSO 24891: Out of range error is occurring because nodeBeforeCursor
                                    // is not including the trigger character. In this case, the node before
                                    // the node before cursor is the trigger character, and this is where the range should start.
                                    let nodeBeforeNodeBeforeCursor =
                                        nodeBeforeCursor?.previousSibling ?? null;
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

                                if (rect) {
                                    rangeNode.detach();

                                    // Display the @mention popup in the correct place
                                    let targetPoint = {
                                        x: rect.left,
                                        y: (rect.bottom + rect.top) / 2,
                                    };
                                    let bufferZone = (rect.bottom - rect.top) / 2;
                                    this.dataProvider.setCursorPoint(targetPoint, bufferZone);
                                }
                            }
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
    }

    private onKeyDownEvent(event: PluginKeyboardEvent) {
        let keyboardEvent = event.rawEvent;
        if (this.isSuggesting) {
            if (keyboardEvent.key == ESC_CHAR_CODE) {
                this.setIsSuggesting(false);
                this.blockSuggestions = true;
                this.cancelDefaultKeyDownEvent(event);
            } else if (keyboardEvent.key == BACKSPACE_CHAR_CODE) {
                // #483: If we are backspacing over the trigger character that triggered this Picker
                // then we need to hide the Picker
                const wordBeforeCursor = this.getWord(event);
                if (wordBeforeCursor == this.pickerOptions.triggerCharacter) {
                    this.setIsSuggesting(false);
                }
            } else if (
                this.dataProvider.shiftHighlight &&
                (this.pickerOptions.isHorizontal
                    ? keyboardEvent.key == LEFT_ARROW_CHAR_CODE ||
                      keyboardEvent.key == RIGHT_ARROW_CHAR_CODE
                    : keyboardEvent.key == UP_ARROW_CHAR_CODE ||
                      keyboardEvent.key == DOWN_ARROW_CHAR_CODE)
            ) {
                this.dataProvider.shiftHighlight(
                    this.pickerOptions.isHorizontal
                        ? keyboardEvent.key == RIGHT_ARROW_CHAR_CODE
                        : keyboardEvent.key == DOWN_ARROW_CHAR_CODE
                );

                if (this.dataProvider.getSelectedIndex) {
                    this.setAriaActiveDescendant(this.dataProvider.getSelectedIndex());
                }

                this.cancelDefaultKeyDownEvent(event);
            } else if (
                this.dataProvider.selectOption &&
                (keyboardEvent.key == ENTER_CHAR_CODE || keyboardEvent.key == TAB_CHAR_CODE)
            ) {
                this.dataProvider.selectOption();
                this.cancelDefaultKeyDownEvent(event);
            } else {
                // Currently no op.
            }
        } else {
            if (keyboardEvent.key == BACKSPACE_CHAR_CODE) {
                const nodeRemoved = this.tryRemoveNode(event);
                if (nodeRemoved) {
                    this.cancelDefaultKeyDownEvent(event);
                }
            } else if (keyboardEvent.key == DELETE_CHAR_CODE) {
                let searcher = this.editor?.getContentSearcherOfCursor(event);
                if (searcher) {
                    let nodeAfterCursor = searcher.getInlineElementAfter()
                        ? searcher.getInlineElementAfter()?.getContainerNode()
                        : null;
                    let nodeId = nodeAfterCursor ? this.getIdValue(nodeAfterCursor) : null;
                    if (
                        nodeId &&
                        nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0 &&
                        nodeAfterCursor
                    ) {
                        let replacementNode = this.dataProvider.onRemove(nodeAfterCursor, false);
                        this.replaceNode(nodeAfterCursor, replacementNode);
                        this.cancelDefaultKeyDownEvent(event);
                    }
                }
            }
        }
    }

    private onAndroidInputEvent(event: PluginInputEvent) {
        this.newInputLength = this.calcInputLength(event);

        if (
            this.newInputLength < this.currentInputLength ||
            (event.rawEvent as any).inputType === DELETE_CONTENT_BACKWARDS_INPUT_TYPE
        ) {
            const nodeRemoved = this.tryRemoveNode(event);
            if (nodeRemoved) {
                this.eventHandledOnKeyDown = true;
            }
        }
    }

    private calcInputLength(event: PluginEvent) {
        const wordBeforeCursor = this.getInlineElementBeforeCursor(event);
        return wordBeforeCursor ? wordBeforeCursor.length : 0;
    }

    private tryRemoveNode(event: PluginDomEvent): boolean {
        if (!this.editor) {
            return false;
        }

        const searcher = this.editor.getContentSearcherOfCursor(event);
        if (!searcher) {
            return false;
        }

        const inlineElementBefore = searcher.getInlineElementBefore();
        const nodeBeforeCursor = inlineElementBefore
            ? inlineElementBefore.getContainerNode()
            : null;
        const nodeId = nodeBeforeCursor ? this.getIdValue(nodeBeforeCursor) : null;
        const inlineElementAfter = searcher.getInlineElementAfter();

        if (
            nodeBeforeCursor &&
            nodeId &&
            nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0 &&
            (inlineElementAfter == null || !(inlineElementAfter instanceof PartialInlineElement))
        ) {
            const replacementNode = this.dataProvider.onRemove(nodeBeforeCursor, true);
            if (replacementNode) {
                this.replaceNode(nodeBeforeCursor, replacementNode);
                if (this.isPendingInputEventHandling) {
                    this.editor.runAsync(editor => {
                        editor.select(replacementNode, PositionType.After);
                    });
                } else {
                    this.editor.select(replacementNode, PositionType.After);
                }

                return true;
            } else {
                // Select the node then let browser delete it
                this.editor.select(nodeBeforeCursor);
                return false;
            }
        }
        return false;
    }

    private getWord(event: PluginKeyboardEvent | null) {
        let wordFromRange = this.getRangeUntilAt(event)?.toString() ?? '';
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

    private setRangeStart(rangeNode: Range, node: Node | null, target: string) {
        let nodeOffset = node?.textContent ? node.textContent.lastIndexOf(target) : -1;
        if (node && nodeOffset > -1) {
            rangeNode.setStart(node, nodeOffset);
            return true;
        }
        return false;
    }

    private setAriaOwns(isSuggesting: boolean) {
        this.editor?.setEditorDomAttribute(
            'aria-owns',
            isSuggesting && this.pickerOptions.suggestionsLabel
                ? this.pickerOptions.suggestionsLabel
                : null
        );
    }

    private setAriaActiveDescendant(selectedIndex: number | null) {
        this.editor?.setEditorDomAttribute(
            'aria-activedescendant',
            selectedIndex != null && this.pickerOptions.suggestionLabelPrefix
                ? this.pickerOptions.suggestionLabelPrefix + selectedIndex.toString()
                : null
        );
    }

    private getInlineElementBeforeCursor(event: PluginEvent): string | null {
        const searcher = this.editor?.getContentSearcherOfCursor(event);
        const element = searcher ? searcher.getInlineElementBefore() : null;
        return element ? element.getTextContent() : null;
    }

    private isAndroidKeyboardEvent(event: PluginKeyboardEvent): boolean {
        // Check keyboard events on Android for further handling.
        // On Android Webview later 51, the KeyboardEvent's key is "Unidentified".
        // On Android Webview below 51, the KeyboardEvent's key is not supported and always returns undefined,
        // so using the charCode property, which is 0 or 229.
        return (
            event.rawEvent.key == UNIDENTIFIED_KEY ||
            (event.rawEvent.key == undefined &&
                UNIDENTIFIED_CODE.indexOf(event.rawEvent.charCode) > -1)
        );
    }
}
