import { ChangeSource, isPunctuation, mergeModel } from 'roosterjs-content-model-dom';
import { formatTextSegmentBeforeSelectionMarker } from 'roosterjs-content-model-api';
import { splitTextSegment } from '../pluginUtils/splitTextSegment';
import type { IPickerPlugin } from './IPickerPlugin';
import type {
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    EditorPlugin,
    IEditor,
    PluginEvent,
} from 'roosterjs-content-model-types';
import type { PickerPluginOptions } from './PickerPluginOptions';

/**
 * PickerPlugin represents a plugin of editor which can handle picker related behaviors, including
 * - Show picker when special trigger key is pressed
 * - Hide picker
 * - Change selection in picker by Up/Down/Left/Right
 * - Apply selected item in picker
 *
 * PickerPlugin doesn't provide any UI, it just wraps related DOM events and invoke callback functions.
 */
export abstract class PickerPluginBase implements EditorPlugin, IPickerPlugin {
    protected editor: IEditor | null = null;
    private isSuggesting: boolean = false;
    private lastQueryString = '';

    constructor(private pickerOptions: PickerPluginOptions) {}

    /**
     * Function called when the picker changes suggesting state
     * (isSuggesting - true: Plugin is being shown; false: Plugin is being hidden).
     */
    abstract onIsSuggestingChanged?: (isSuggesting: boolean) => void;

    /**
     * Function called when the query string (text after the trigger symbol) is updated.
     */
    abstract onQueryStringUpdated?: (queryString: string) => void;

    /**
     * Handler of scroll event from scroll container of editor
     */
    abstract onScroll?: (scrollContainer: HTMLElement) => void;

    /**
     * Function that is called by the plugin to set the current cursor position as an
     * anchor point for where to show UX.
     */
    abstract setCursorPoint?: (targetPoint: { x: number; y: number }, buffer: number) => void;

    /**
     * Function called when a keypress is issued that would move the highlight on any picker UX.
     */
    abstract shiftHighlight?: (isIncrement: boolean) => void;

    /**
     * Function that returns the index of the option currently selected in the picker.
     */
    abstract getSelectedIndex?: () => number;

    /**
     * Function called when a keypress is issued that would "select" a currently highlighted option.
     */
    abstract selectOption?: () => void;

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
    initialize(editor: IEditor) {
        this.editor = editor;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        this.editor = null;
        this.isSuggesting = false;
    }

    commit(modelToMerge: ContentModelDocument) {
        const editor = this.editor;

        if (editor) {
            editor.focus();

            formatTextSegmentBeforeSelectionMarker(
                editor,
                (model, previousSegment, paragraph, _, context) => {
                    const potentialSegments: ContentModelText[] = [];
                    const queryString = this.getQueryString(
                        paragraph,
                        previousSegment,
                        potentialSegments
                    );

                    if (queryString) {
                        potentialSegments.forEach(x => (x.isSelected = true));
                        mergeModel(model, modelToMerge, context);
                        context.canUndoByBackspace = this.pickerOptions.handleAutoComplete;
                        return true;
                    } else {
                        return false;
                    }
                },
                {
                    changeSource: this.pickerOptions.changeSource,
                    onNodeCreated: this.pickerOptions.onNodeCreated,
                }
            );

            this.setIsSuggesting(false /*isSuggesting*/);
        }
    }

    setIsSuggesting(isSuggesting: boolean) {
        if (this.isSuggesting != isSuggesting) {
            this.isSuggesting = isSuggesting;

            this.onIsSuggestingChanged?.(isSuggesting);
            this.setAriaOwns(isSuggesting);
            this.setAriaActiveDescendant(isSuggesting ? 0 : null);

            this.setQueryString('');
        }
    }

    setQueryString(queryString: string) {
        this.lastQueryString = queryString;

        if (this.isSuggesting) {
            this.onQueryStringUpdated?.(this.lastQueryString);
        }
    }

    /**
     * Check if the plugin should handle the given event exclusively.
     * Handle an event exclusively means other plugin will not receive this event in
     * onPluginEvent method.
     * If two plugins will return true in willHandleEventExclusively() for the same event,
     * the final result depends on the order of the plugins are added into editor
     * @param event The event to check
     */
    willHandleEventExclusively(event: PluginEvent) {
        return (
            this.isSuggesting &&
            (event.eventType == 'keyDown' ||
                event.eventType == 'keyUp' ||
                event.eventType == 'input')
        );
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }

        switch (event.eventType) {
            case 'contentChanged':
                if (event.source == ChangeSource.SetContent) {
                    // Stop suggesting since content is fully changed
                    this.setIsSuggesting(false);
                } else if (this.isSuggesting) {
                    this.onSuggestingInput(this.editor);
                }
                break;

            case 'keyDown':
                if (this.isSuggesting) {
                    this.onSuggestingKeyDown(this.editor, event.rawEvent);
                }
                break;

            case 'input':
                (this.isSuggesting ? this.onSuggestingInput : this.onInput)(
                    this.editor,
                    event.rawEvent
                );
                break;

            case 'mouseUp':
                if (this.isSuggesting) {
                    this.setIsSuggesting(false);
                }
                break;
        }
    }

    private onSuggestingKeyDown(editor: IEditor, event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowRight':
                if (this.pickerOptions.isHorizontal) {
                    const isIncrement = event.key == 'ArrowRight';
                    this.shiftHighlight?.(
                        this.pickerOptions.isRightToLeft ? !isIncrement : isIncrement
                    );
                }
                event.preventDefault();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
                if (this.pickerOptions.isHorizontal) {
                    this.shiftHighlight?.(event.key == 'ArrowDown');
                }
                event.preventDefault();
                break;

            case 'Escape':
                this.setIsSuggesting(false /*isSuggesting*/);
                event.preventDefault();
                break;

            case 'Enter':
            case 'Tab':
                this.selectOption?.();
                event.preventDefault();
                break;
        }
    }

    private onSuggestingInput(editor: IEditor) {
        formatTextSegmentBeforeSelectionMarker(editor, (_, segment, paragraph) => {
            const newQueryString = this.getQueryString(paragraph, segment);

            if (
                newQueryString &&
                ((newQueryString.length >= this.lastQueryString.length &&
                    newQueryString.indexOf(this.lastQueryString) == 0) ||
                    (newQueryString.length < this.lastQueryString.length &&
                        this.lastQueryString.indexOf(newQueryString) == 0))
            ) {
                this.setQueryString(newQueryString);
            } else {
                this.setIsSuggesting(false /*isSuggesting*/);
            }

            return false;
        });
    }

    private onInput(editor: IEditor, event: InputEvent) {
        if (event.inputType == 'insertText' && event.data == this.pickerOptions.triggerCharacter) {
            formatTextSegmentBeforeSelectionMarker(editor, (_, segment, paragraph) => {
                if (segment.text.endsWith(this.pickerOptions.triggerCharacter)) {
                    const charBeforeTrigger = segment.text[segment.text.length - 2];

                    if (!charBeforeTrigger || isPunctuation(charBeforeTrigger)) {
                        this.setIsSuggesting(true /*isSuggesting*/, { x: 1, y: 2 });
                        this.setQueryString(this.getQueryString(paragraph, segment));
                    }
                }

                return false;
            });
        }
    }

    private getQueryString(
        paragraph: ContentModelParagraph,
        previousSegment: ContentModelText,
        splittedSegmentResult?: ContentModelText[]
    ): string {
        let result = '';

        for (let i = paragraph.segments.indexOf(previousSegment); i >= 0; i--) {
            const segment = paragraph.segments[i];

            if (segment.segmentType != 'Text') {
                result = '';
                break;
            }

            const index = segment.text.lastIndexOf(this.pickerOptions.triggerCharacter);

            if (index >= 0) {
                result = segment.text.substring(index) + result;

                splittedSegmentResult?.push(
                    index > 0
                        ? splitTextSegment(segment, paragraph, index, segment.text.length)
                        : segment
                );

                break;
            } else {
                result = segment.text + result;

                splittedSegmentResult?.push(segment);
            }
        }

        return result;
    }

    ////////////////

    // private cancelDefaultKeyDownEvent(event: KeyDownEvent) {
    //     this.eventHandledOnKeyDown = true;
    //     event.rawEvent.preventDefault();
    //     event.rawEvent.stopImmediatePropagation();
    // }

    // private getIdValue(node: Node): string | null {
    //     if (isNodeOfType(node, 'ELEMENT_NODE')) {
    //         const attribute = node.attributes.getNamedItem('id');
    //         return attribute ? (attribute.value as string) : null;
    //     } else {
    //         return null;
    //     }
    // }

    // private getWordBeforeCursor(event: KeyDownEvent | KeyUpEvent | null): string | null {
    //     const searcher = this.editor?.getContentSearcherOfCursor(event);
    //     return searcher ? searcher.getWordBefore() : null;
    // }

    // private replaceNode(currentNode: Node | null, replacementNode: Node | null) {
    //     this.editor?.addUndoSnapshot(() => {
    //         if (currentNode) {
    //             this.editor?.deleteNode(currentNode);
    //         }
    //         if (replacementNode) {
    //             this.editor?.insertNode(replacementNode);
    //         }
    //     }, ChangeSource.Keyboard);
    // }

    // private shouldHandleKeyUpEvent(event: KeyUpEvent) {
    //     // onKeyUpDomEvent should only be called when a key that produces a character value is pressed
    //     // This check will always fail on Android since the KeyboardEvent's key is "Unidentified" or undefined
    //     // However, we don't need to check for modifier events on mobile, so can ignore this check
    //     return (
    //         this.isAndroidKeyboardEvent(event) ||
    //         isCharacterValue(event.rawEvent) ||
    //         (this.isSuggesting && !isModifierKey(event.rawEvent))
    //     );
    // }

    // private onKeyUpDomEvent(event: KeyUpEvent) {
    //     if (this.editor) {
    //         if (this.isSuggesting) {
    //             // Word before cursor represents the text prior to the cursor, up to and including the trigger symbol.
    //             const wordBeforeCursor = this.getWord(event);
    //             if (wordBeforeCursor !== null) {
    //                 const wordBeforeCursorWithoutTriggerChar = wordBeforeCursor.substring(1);
    //                 const trimmedWordBeforeCursor = wordBeforeCursorWithoutTriggerChar.trim();

    //                 // If we hit a case where wordBeforeCursor is just the trigger character,
    //                 // that means we've gotten an onKeyUp event right after it's been typed.
    //                 // Otherwise, update the query string when:
    //                 // 1. There's an actual value
    //                 // 2. That actual value isn't just pure whitespace
    //                 // 3. That actual value isn't more than 4 words long (at which point we assume the person kept typing)
    //                 // Otherwise, we want to dismiss the picker plugin's UX.
    //                 if (
    //                     wordBeforeCursor == this.pickerOptions.triggerCharacter ||
    //                     (trimmedWordBeforeCursor &&
    //                         trimmedWordBeforeCursor.length > 0 &&
    //                         trimmedWordBeforeCursor.split(' ').length <= 4)
    //                 ) {
    //                     this.onQueryStringUpdated?.(
    //                         trimmedWordBeforeCursor,
    //                         wordBeforeCursorWithoutTriggerChar == trimmedWordBeforeCursor
    //                     );
    //                 } else {
    //                     this.setIsSuggesting(false);
    //                 }
    //             }
    //         } else {
    //             const wordBeforeCursor = this.getWordBeforeCursor(event);
    //             if (!this.blockSuggestions) {
    //                 if (
    //                     wordBeforeCursor != null &&
    //                     wordBeforeCursor.split(' ').length <= 4 &&
    //                     (wordBeforeCursor[0] == this.pickerOptions.triggerCharacter ||
    //                         (wordBeforeCursor[0] == '(' &&
    //                             wordBeforeCursor[1] == this.pickerOptions.triggerCharacter))
    //                 ) {
    //                     this.setIsSuggesting(true);
    //                     const wordBeforeCursorWithoutTriggerChar = wordBeforeCursor.substring(1);
    //                     const trimmedWordBeforeCursor = wordBeforeCursorWithoutTriggerChar.trim();
    //                     this.onQueryStringUpdated?.(
    //                         trimmedWordBeforeCursor,
    //                         wordBeforeCursorWithoutTriggerChar == trimmedWordBeforeCursor
    //                     );

    //                     if (this.setCursorPoint) {
    //                         // Determine the bounding rectangle for the @mention
    //                         const searcher = this.editor.getContentSearcherOfCursor(event);
    //                         const rangeNode = this.editor.getDocument().createRange();

    //                         if (rangeNode) {
    //                             const nodeBeforeCursor =
    //                                 searcher?.getInlineElementBefore()?.getContainerNode() ?? null;

    //                             const rangeStartSuccessfullySet = this.setRangeStart(
    //                                 rangeNode,
    //                                 nodeBeforeCursor,
    //                                 wordBeforeCursor
    //                             );
    //                             if (!rangeStartSuccessfullySet) {
    //                                 // VSO 24891: Out of range error is occurring because nodeBeforeCursor
    //                                 // is not including the trigger character. In this case, the node before
    //                                 // the node before cursor is the trigger character, and this is where the range should start.
    //                                 const nodeBeforeNodeBeforeCursor =
    //                                     nodeBeforeCursor?.previousSibling ?? null;
    //                                 this.setRangeStart(
    //                                     rangeNode,
    //                                     nodeBeforeNodeBeforeCursor,
    //                                     this.pickerOptions.triggerCharacter
    //                                 );
    //                             }
    //                             let rect = rangeNode.getBoundingClientRect();

    //                             // Safari's support for range.getBoundingClientRect is incomplete.
    //                             // We perform this check to fall back to getClientRects in case it's at the page origin.
    //                             if (rect.left == 0 && rect.bottom == 0 && rect.top == 0) {
    //                                 rect = rangeNode.getClientRects()[0];
    //                             }

    //                             if (rect) {
    //                                 rangeNode.detach();

    //                                 // Display the @mention popup in the correct place
    //                                 const targetPoint = {
    //                                     x: rect.left,
    //                                     y: (rect.bottom + rect.top) / 2,
    //                                 };
    //                                 const bufferZone = (rect.bottom - rect.top) / 2;
    //                                 this.setCursorPoint(targetPoint, bufferZone);
    //                             }
    //                         }
    //                     }
    //                 }
    //             } else {
    //                 if (
    //                     wordBeforeCursor != null &&
    //                     wordBeforeCursor[0] != this.pickerOptions.triggerCharacter
    //                 ) {
    //                     this.blockSuggestions = false;
    //                 }
    //             }
    //         }
    //     }
    // }

    // private onKeyDownEvent(event: KeyDownEvent) {
    //     const keyboardEvent = event.rawEvent;

    //     if (this.isSuggesting) {
    //         if (keyboardEvent.key == 'Escape') {
    //             this.setIsSuggesting(false);
    //             this.blockSuggestions = true;
    //             this.cancelDefaultKeyDownEvent(event);
    //         } else if (keyboardEvent.key == 'Backspace') {
    //             // #483: If we are backspacing over the trigger character that triggered this Picker
    //             // then we need to hide the Picker
    //             const wordBeforeCursor = this.getWord(event);
    //             if (wordBeforeCursor == this.pickerOptions.triggerCharacter) {
    //                 this.setIsSuggesting(false);
    //             }
    //         } else if (
    //             this.shiftHighlight &&
    //             (this.pickerOptions.isHorizontal
    //                 ? keyboardEvent.key == 'ArrowLeft' || keyboardEvent.key == 'ArrowRight'
    //                 : keyboardEvent.key == 'ArrowUp' || keyboardEvent.key == 'ArrowDown')
    //         ) {
    //             this.shiftHighlight(
    //                 this.pickerOptions.isHorizontal
    //                     ? keyboardEvent.key == 'ArrowRight'
    //                     : keyboardEvent.key == 'ArrowDown'
    //             );

    //             if (this.getSelectedIndex) {
    //                 this.setAriaActiveDescendant(this.getSelectedIndex());
    //             }

    //             this.cancelDefaultKeyDownEvent(event);
    //         } else if (
    //             this.selectOption &&
    //             (keyboardEvent.key == 'Enter' || keyboardEvent.key == 'Tab')
    //         ) {
    //             this.selectOption();
    //             this.cancelDefaultKeyDownEvent(event);
    //         } else {
    //             // Currently no op.
    //         }
    //     } else {
    //         if (keyboardEvent.key == 'Backspace') {
    //             const nodeRemoved = this.tryRemoveNode(event);
    //             if (nodeRemoved) {
    //                 this.cancelDefaultKeyDownEvent(event);
    //             }
    //         } else if (keyboardEvent.key == 'Delete') {
    //             const searcher = this.editor?.getContentSearcherOfCursor(event);
    //             if (searcher) {
    //                 const inlineElementAfter = searcher.getInlineElementAfter();
    //                 let nodeAfterCursor = inlineElementAfter
    //                     ? inlineElementAfter.getContainerNode()
    //                     : null;
    //                 nodeAfterCursor = this.getParentNodeIfTextNode(nodeAfterCursor);
    //                 const nodeId = nodeAfterCursor ? this.getIdValue(nodeAfterCursor) : null;
    //                 if (
    //                     nodeId &&
    //                     nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0 &&
    //                     nodeAfterCursor
    //                 ) {
    //                     const replacementNode = this.onRemove?.(nodeAfterCursor, false);
    //                     this.replaceNode(nodeAfterCursor, replacementNode);
    //                     this.cancelDefaultKeyDownEvent(event);
    //                 }
    //             }
    //         }
    //     }
    // }

    // private getParentNodeIfTextNode(node: Node | null): Node | null {
    //     if (isNodeOfType(node, 'TEXT_NODE')) {
    //         node = node.parentNode;
    //     }
    //     return node;
    // }

    // private onAndroidInputEvent(event: EditorInputEvent) {
    //     this.newInputLength = this.calcInputLength(event);

    //     if (
    //         this.newInputLength < this.currentInputLength ||
    //         event.rawEvent.inputType === 'deleteContentBackwards'
    //     ) {
    //         const nodeRemoved = this.tryRemoveNode(event);
    //         if (nodeRemoved) {
    //             this.eventHandledOnKeyDown = true;
    //         }
    //     }
    // }

    // private calcInputLength(event: PluginEvent) {
    //     const wordBeforeCursor = this.getInlineElementBeforeCursor(event);
    //     return wordBeforeCursor ? wordBeforeCursor.length : 0;
    // }

    // private tryRemoveNode(event: KeyDownEvent | EditorInputEvent): boolean {
    //     if (!this.editor) {
    //         return false;
    //     }
    //     const searcher = this.editor.getContentSearcherOfCursor(event);
    //     if (!searcher) {
    //         return false;
    //     }

    //     const inlineElementBefore = searcher.getInlineElementBefore();
    //     let nodeBeforeCursor = inlineElementBefore ? inlineElementBefore.getContainerNode() : null;
    //     nodeBeforeCursor = this.getParentNodeIfTextNode(nodeBeforeCursor);
    //     const nodeId = nodeBeforeCursor ? this.getIdValue(nodeBeforeCursor) : null;
    //     const inlineElementAfter = searcher.getInlineElementAfter();

    //     if (
    //         nodeBeforeCursor &&
    //         nodeId &&
    //         nodeId.indexOf(this.pickerOptions.elementIdPrefix) == 0 &&
    //         (inlineElementAfter == null || !(inlineElementAfter instanceof PartialInlineElement))
    //     ) {
    //         const replacementNode = this.onRemove?.(nodeBeforeCursor, true);
    //         if (replacementNode) {
    //             this.replaceNode(nodeBeforeCursor, replacementNode);
    //             if (this.isPendingInputEventHandling) {
    //                 this.editor.runAsync(editor => {
    //                     editor.select(replacementNode, PositionType.After);
    //                 });
    //             } else {
    //                 this.editor.select(replacementNode, PositionType.After);
    //             }

    //             return true;
    //         } else {
    //             // Select the node then let browser delete it
    //             this.editor.select(nodeBeforeCursor);
    //             return false;
    //         }
    //     }
    //     return false;
    // }

    // private setRangeStart(rangeNode: Range, node: Node | null, target: string) {
    //     const nodeOffset = node?.textContent ? node.textContent.lastIndexOf(target) : -1;
    //     if (node && nodeOffset > -1) {
    //         rangeNode.setStart(node, nodeOffset);
    //         return true;
    //     }
    //     return false;
    // }

    private setAriaOwns(isSuggesting: boolean) {
        this.editor
            ?.getDOMHelper()
            .setDomAttribute(
                'aria-owns',
                isSuggesting && this.pickerOptions.suggestionsLabel
                    ? this.pickerOptions.suggestionsLabel
                    : null
            );
    }

    private setAriaActiveDescendant(selectedIndex: number | null) {
        this.editor
            ?.getDOMHelper()
            .setDomAttribute(
                'aria-activedescendant',
                selectedIndex != null && this.pickerOptions.suggestionLabelPrefix
                    ? this.pickerOptions.suggestionLabelPrefix + selectedIndex.toString()
                    : null
            );
    }

    // private getInlineElementBeforeCursor(event: PluginEvent): string | null {
    //     const searcher = this.editor?.getContentSearcherOfCursor(event);
    //     const element = searcher ? searcher.getInlineElementBefore() : null;
    //     return element ? element.getTextContent() : null;
    // }

    // private isAndroidKeyboardEvent(event: KeyDownEvent | KeyUpEvent): boolean {
    //     // Check keyboard events on Android for further handling.
    //     // On Android Webview later 51, the KeyboardEvent's key is "Unidentified".
    //     // On Android Webview below 51, the KeyboardEvent's key is not supported and always returns undefined,
    //     // so using the charCode property, which is 0 or 229.
    //     return (
    //         event.rawEvent.key == 'Unidentified' ||
    //         (event.rawEvent.key == undefined &&
    //             UNIDENTIFIED_CODE.indexOf(event.rawEvent.charCode) > -1)
    //     );
    // }
}
