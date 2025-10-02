import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { getNodePositionFromEvent } from '../utils/getNodePositionFromEvent';
import { repositionTouchSelection } from './repositionTouchSelection';

const POINTER_DETECTION_DELAY = 150; // Delay time to wait for selection to be updated and also detect if pointerup is a tap or part of double tap
const PUNCTUATION_MATCHING_REGEX = /[.,;:!]/;
const SPACE_MATCHING_REGEX = /\s/;
const CARET_CSS_RULE = 'caret-color: transparent';
const HIDE_CURSOR_CSS_KEY = '_DOMSelectionHideCursor';

/**
 * Touch plugin to manage touch behaviors
 */
export class TouchPlugin implements EditorPlugin {
    private editor: IEditor | null = null;
    private timer = 0;
    private isDblClicked: boolean = false;
    private isTouchPenPointerEvent: boolean = false;

    /**
     * Create an instance of Touch plugin
     */
    constructor() {}

    /**
     * Get a friendly name of  this plugin
     */
    getName() {
        return 'Touch';
    }

    /**
     * Initialize this plugin. This should only be called from Editor
     * @param editor Editor instance
     */
    initialize(editor: IEditor) {
        this.editor = editor;
        this.isDblClicked = false;
    }

    /**
     * Dispose this plugin
     */
    dispose() {
        if (this.timer) {
            this.editor?.getDocument()?.defaultView?.clearTimeout(this.timer);
            this.timer = 0;
        }
        this.editor = null;
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
            case 'pointerDown':
                this.isDblClicked = false;
                this.isTouchPenPointerEvent = true;

                const targetWindow = this.editor.getDocument()?.defaultView || window;
                if (this.timer) {
                    targetWindow.clearTimeout(this.timer);
                }
                this.editor.setEditorStyle(HIDE_CURSOR_CSS_KEY, CARET_CSS_RULE);
                this.timer = targetWindow.setTimeout(() => {
                    this.timer = 0;

                    if (!this.isDblClicked && this.editor) {
                        repositionTouchSelection(this.editor);
                        // reset values
                        this.isTouchPenPointerEvent = false;
                        this.editor.setEditorStyle(HIDE_CURSOR_CSS_KEY, null);
                    }
                }, POINTER_DETECTION_DELAY);

                break;
            case 'doubleClick':
                if (this.isTouchPenPointerEvent) {
                    event.rawEvent.preventDefault();

                    this.isDblClicked = true;
                    const caretPosition = getNodePositionFromEvent(
                        this.editor,
                        event.rawEvent.x,
                        event.rawEvent.y
                    );

                    if (caretPosition) {
                        const { node, offset } = caretPosition;

                        if (node.nodeType !== Node.TEXT_NODE) {
                            return;
                        }

                        const nodeTextContent = node.nodeValue || '';
                        const char = nodeTextContent.charAt(offset);

                        // Check if the clicked character is a punctuation mark, then highlight that character only
                        if (PUNCTUATION_MATCHING_REGEX.test(char)) {
                            const newRange = this.editor.getDocument()?.createRange();
                            if (newRange) {
                                newRange.setStart(node, offset);
                                newRange.setEnd(node, offset + 1);
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });
                            }
                        } else if (SPACE_MATCHING_REGEX.test(char)) {
                            // If the clicked character is an open space with no word of right side
                            const rightSideOfChar = nodeTextContent.substring(
                                offset,
                                nodeTextContent.length
                            );
                            const isRightSideAllSpaces =
                                rightSideOfChar.length > 0 && !/\S/.test(rightSideOfChar);
                            if (isRightSideAllSpaces) {
                                // select the first space only
                                let start = offset;
                                while (
                                    start > 0 &&
                                    SPACE_MATCHING_REGEX.test(nodeTextContent.charAt(start - 1))
                                ) {
                                    start--;
                                }
                                const newRange = this.editor.getDocument()?.createRange();
                                if (newRange) {
                                    newRange.setStart(node, start);
                                    newRange.setEnd(node, start + 1);
                                    this.editor.setDOMSelection({
                                        type: 'range',
                                        range: newRange,
                                        isReverted: false,
                                    });
                                }
                            }
                        } else {
                            const { wordStart, wordEnd } = findWordBoundaries(
                                nodeTextContent,
                                offset
                            );
                            const newRange = this.editor.getDocument()?.createRange();
                            if (newRange) {
                                newRange.setStart(node, wordStart);
                                newRange.setEnd(node, wordEnd);
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });
                            }
                        }
                    }
                }
                break;
        }
    }
}

/**
 * @internal
 * Finds the start and end indices of the word at the given offset in the text.
 * @param text The string to search within.
 * @param offset The index within the string to find the word boundaries around.
 * @returns An object containing wordStart and wordEnd indices.
 */
function findWordBoundaries(text: string, offset: number) {
    let start = offset;
    let end = offset;

    // Move start backwards to find word start
    while (
        start > 0 &&
        !SPACE_MATCHING_REGEX.test(text[start - 1]) &&
        !PUNCTUATION_MATCHING_REGEX.test(text[start - 1])
    ) {
        start--;
    }

    // Move end forward to find word end
    while (
        end < text.length &&
        !SPACE_MATCHING_REGEX.test(text[end]) &&
        !PUNCTUATION_MATCHING_REGEX.test(text[end])
    ) {
        end++;
    }

    return {
        wordStart: start,
        wordEnd: end,
    };
}
