import type {
    EditorPlugin,
    IEditor,
    PluginEvent,
    ContentModelText,
} from 'roosterjs-content-model-types';
import { getNodePositionFromEvent } from '../utils/getNodePositionFromEvent';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import { adjustWordSelection } from 'roosterjs-content-model-api';

const MAX_TOUCH_MOVE_DISTANCE = 6; // the max number of offsets for the touch selection to move
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
                this.editor.setEditorStyle(HIDE_CURSOR_CSS_KEY, CARET_CSS_RULE);

                const targetWindow = this.editor.getDocument()?.defaultView || window;
                if (this.timer) {
                    targetWindow.clearTimeout(this.timer);
                }

                this.timer = targetWindow.setTimeout(() => {
                    this.timer = 0;

                    if (this.editor) {
                        if (!this.isDblClicked) {
                            this.repositionTouchSelection();

                            // reset values
                            this.isTouchPenPointerEvent = false;
                        }
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

    repositionTouchSelection = () => {
        this.editor?.formatContentModel(
            (model, _context) => {
                if (this.editor) {
                    let segmentAndParagraphs = getSelectedSegmentsAndParagraphs(
                        model,
                        false /*includingFormatHolder*/,
                        true /*includingEntity*/,
                        true /*mutate*/
                    );

                    const isCollapsedSelection =
                        segmentAndParagraphs.length >= 1 &&
                        segmentAndParagraphs.every(x => x[0].segmentType == 'SelectionMarker');

                    // 1. adjust selection to a word if selection is collapsed
                    if (isCollapsedSelection) {
                        const para = segmentAndParagraphs[0][1];
                        const path = segmentAndParagraphs[0][2];

                        segmentAndParagraphs = adjustWordSelection(
                            model,
                            segmentAndParagraphs[0][0]
                        ).map(x => [x, para, path]);

                        // 2. Collect all text segments in selection
                        const segments: ContentModelText[] = [];
                        segmentAndParagraphs.forEach(item => {
                            if (item[0].segmentType == 'Text') {
                                segments.push(item[0]);
                            }
                        });

                        // If there are 3 text segment in the Word, selection is in middle of the word
                        // before selection marker + after selection marker
                        if (segments.length === 2) {
                            // 3. Calculate the offset to move cursor to the nearest edge of the word if within 6 characters
                            // default to end of the word if user tapped in the middle
                            const leftCursorWordLength = segments[0].text.length;
                            const rightCursorWordLength = segments[1].text.length;
                            let movingOffset: number =
                                leftCursorWordLength >= rightCursorWordLength
                                    ? rightCursorWordLength
                                    : -leftCursorWordLength;
                            movingOffset =
                                Math.abs(movingOffset) > MAX_TOUCH_MOVE_DISTANCE ? 0 : movingOffset;

                            // 4. Move cursor to the calculated offset
                            const selection = this.editor.getDOMSelection();
                            if (selection?.type == 'range' && movingOffset !== 0) {
                                const selectedRange = selection.range;
                                const newRange = this.editor.getDocument().createRange();
                                newRange.setStart(
                                    selectedRange.startContainer,
                                    selectedRange.startOffset + movingOffset
                                );
                                newRange.setEnd(
                                    selectedRange.endContainer,
                                    selectedRange.endOffset + movingOffset
                                );
                                this.editor.setDOMSelection({
                                    type: 'range',
                                    range: newRange,
                                    isReverted: false,
                                });
                            }
                        }
                    }
                }
                return false;
            },
            {
                apiName: 'TouchSelection',
            }
        );
    };
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
