import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { getNodePositionFromEvent } from '../utils/getNodePositionFromEvent';

const MAX_TOUCH_MOVE_DISTANCE = 6; // the max number of offsets for the touch selection to move
const POINTER_DETECTION_DELAY = 150; // Delay time to wait for selection to be updated and also detect if pointerup is a tap or part of double tap

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
        this.editor = null;

        if (this.timer) {
            document?.defaultView?.clearTimeout(this.timer);
            this.timer = 0;
        }
    }

    /**
     * Handle events triggered from editor
     * @param event PluginEvent object
     */
    onPluginEvent(event: PluginEvent) {
        if (!this.editor) {
            return;
        }
        const doc = this.editor.getDocument();

        switch (event.eventType) {
            case 'pointerDown':
                this.isDblClicked = false;
                this.isTouchPenPointerEvent = true;
                event.originalEvent.preventDefault();

                if (this.timer) {
                    window.clearTimeout(this.timer);
                }

                this.timer = window.setTimeout(() => {
                    this.timer = 0;

                    if (!this.isDblClicked && this.editor) {
                        const caretPosition = getNodePositionFromEvent(
                            this.editor,
                            event.rawEvent.x,
                            event.rawEvent.y
                        );

                        if (caretPosition) {
                            const { node, offset } = caretPosition;
                            const nodeTextContent = node.textContent || '';
                            const wordAtFocus = nodeTextContent[offset];
                            if (wordAtFocus && /\w/.test(wordAtFocus)) {
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
                                if (movingOffset !== 0) {
                                    const newRange = this.editor.getDocument().createRange();
                                    newRange.setStart(node, offset + movingOffset);
                                    newRange.setEnd(node, offset + movingOffset);
                                    this.editor.setDOMSelection({
                                        type: 'range',
                                        range: newRange,
                                        isReverted: false,
                                    });
                                    return;
                                }
                            } else {
                                const newRange = this.editor.getDocument().createRange();
                                newRange.setStart(node, offset);
                                newRange.setEnd(node, offset);
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });
                            }
                        }

                        // reset values
                        this.isTouchPenPointerEvent = false;
                    }
                }, POINTER_DETECTION_DELAY);

                break;
            case 'doubleClick':
                if (this.isTouchPenPointerEvent) {
                    event.rawEvent.preventDefault();

                    this.isDblClicked = true;
                    if ('caretPositionFromPoint' in doc) {
                        const caretPosition = (doc as any).caretPositionFromPoint(
                            event.rawEvent.x,
                            event.rawEvent.y
                        );
                        if (caretPosition) {
                            const { offsetNode, offset } = caretPosition;

                            if (offsetNode.nodeType !== Node.TEXT_NODE) {
                                return;
                            }

                            const nodeTextContent = offsetNode.nodeValue || '';
                            const char = nodeTextContent.charAt(offset);

                            // Check if the clicked character is a punctuation mark, then highlight that character only
                            if (/[.,;:]/.test(char)) {
                                const newRange = this.editor.getDocument()?.createRange();
                                if (newRange) {
                                    newRange.setStart(offsetNode, offset);
                                    newRange.setEnd(offsetNode, offset + 1);
                                    this.editor.setDOMSelection({
                                        type: 'range',
                                        range: newRange,
                                        isReverted: false,
                                    });
                                }
                            } else if (/\s/.test(char)) {
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
                                        /\s/.test(nodeTextContent.charAt(start - 1))
                                    ) {
                                        start--;
                                    }
                                    const newRange = this.editor.getDocument()?.createRange();
                                    if (newRange) {
                                        newRange.setStart(offsetNode, start);
                                        newRange.setEnd(offsetNode, start + 1);
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
                                    newRange.setStart(offsetNode, wordStart);
                                    newRange.setEnd(offsetNode, wordEnd);
                                    this.editor.setDOMSelection({
                                        type: 'range',
                                        range: newRange,
                                        isReverted: false,
                                    });
                                }
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
    while (start > 0 && /\w/.test(text[start - 1])) {
        start--;
    }

    // Move end forward to find word end
    while (end < text.length && /\w/.test(text[end])) {
        end++;
    }

    return {
        wordStart: start,
        wordEnd: end,
    };
}
