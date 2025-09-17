import type { EditorPlugin, IEditor, PluginEvent } from 'roosterjs-content-model-types';

const MAX_TOUCH_MOVE_DISTANCE = 6; // the max number of offsets for the touch selection to move

/**
 * Touch plugin to manage touch behaviors
 */
export class TouchPlugin implements EditorPlugin {
    private editor: IEditor | null = null;

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
    }

    /**
     * Dispose this plugin
     */
    dispose() {
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
        const doc = this.editor.getDocument();

        switch (event.eventType) {
            case 'pointerUp':
                if ('caretPositionFromPoint' in doc) {
                    const caretPosition = (doc as any).caretPositionFromPoint(
                        event.rawEvent.x,
                        event.rawEvent.y
                    );

                    if (caretPosition) {
                        const { offsetNode, offset } = caretPosition;
                        const nodeTextContent = offsetNode.textContent || '';
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
                                Math.abs(movingOffset) > MAX_TOUCH_MOVE_DISTANCE ? 0 : movingOffset;
                            if (movingOffset !== 0) {
                                const newRange = this.editor.getDocument().createRange();
                                newRange.setStart(offsetNode, offset + movingOffset);
                                newRange.setEnd(offsetNode, offset + movingOffset);
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });
                                return;
                            }
                        }

                        const newRange = this.editor.getDocument().createRange();
                        newRange.setStart(offsetNode, offset);
                        newRange.setEnd(offsetNode, offset);
                        this.editor.setDOMSelection({
                            type: 'range',
                            range: newRange,
                            isReverted: false,
                        });
                    }
                }
                break;
            case 'pointerDoubleClick':
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
                                while (start > 0 && /\s/.test(nodeTextContent.charAt(start - 1))) {
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
                break;
        }
    }
}

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
