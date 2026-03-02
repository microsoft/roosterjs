import { getNodePositionFromEvent } from 'roosterjs-content-model-dom';
import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

const MAX_TOUCH_MOVE_DISTANCE = 6; // the max number of offsets for the touch selection to move
const POINTER_DETECTION_DELAY = 150; // Delay time to wait for selection to be updated and also detect if pointerup is a tap or part of double tap
const PUNCTUATION_MATCHING_REGEX = /[.,;:!]/;
const SPACE_MATCHING_REGEX = /\s/;

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
                event.originalEvent.preventDefault();

                const targetWindow = this.editor.getDocument().defaultView;

                if (targetWindow) {
                    if (this.timer) {
                        targetWindow.clearTimeout(this.timer);
                    }

                    this.timer = targetWindow.setTimeout(() => {
                        this.timer = 0;

                        if (this.editor) {
                            if (!this.isDblClicked) {
                                this.editor.focus();
                                const caretPosition = getNodePositionFromEvent(
                                    this.editor.getDocument(),
                                    this.editor.getDOMHelper(),
                                    event.rawEvent.x,
                                    event.rawEvent.y
                                );

                                const newRange = this.editor.getDocument().createRange();
                                if (caretPosition) {
                                    const { node, offset } = caretPosition;

                                    // Place cursor at same position of browser handler by default
                                    newRange.setStart(node, offset);
                                    newRange.setEnd(node, offset);

                                    const nodeTextContent = node.textContent || '';
                                    const charAtSelection = nodeTextContent[offset];
                                    if (
                                        node.nodeType === Node.TEXT_NODE &&
                                        charAtSelection &&
                                        !SPACE_MATCHING_REGEX.test(charAtSelection) &&
                                        !PUNCTUATION_MATCHING_REGEX.test(charAtSelection)
                                    ) {
                                        const { wordStart, wordEnd } = findWordBoundaries(
                                            nodeTextContent,
                                            offset
                                        );

                                        // Move cursor to the calculated offset
                                        const leftCursorWordLength = offset - wordStart;
                                        const rightCursorWordLength = wordEnd - offset;
                                        let movingOffset: number =
                                            leftCursorWordLength >= rightCursorWordLength
                                                ? rightCursorWordLength
                                                : -leftCursorWordLength;
                                        movingOffset =
                                            Math.abs(movingOffset) > MAX_TOUCH_MOVE_DISTANCE
                                                ? 0
                                                : movingOffset;
                                        const newOffsetPosition = offset + movingOffset;
                                        if (
                                            movingOffset !== 0 &&
                                            nodeTextContent.length >= newOffsetPosition
                                        ) {
                                            newRange.setStart(node, newOffsetPosition);
                                            newRange.setEnd(node, newOffsetPosition);
                                        }
                                    }
                                }
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });

                                // reset values
                                this.isTouchPenPointerEvent = false;
                            }
                        }
                    }, POINTER_DETECTION_DELAY);
                }
                break;
            case 'doubleClick':
                if (this.isTouchPenPointerEvent) {
                    event.rawEvent.preventDefault();

                    this.isDblClicked = true;
                    const caretPosition = getNodePositionFromEvent(
                        this.editor.getDocument(),
                        this.editor.getDOMHelper(),
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
