import ContentTraverser from './ContentTraverser';
import createRange from '../selection/createRange';
import {
    IContentTraverser,
    InlineElement,
    IPositionContentSearcher,
    NodePosition,
} from 'roosterjs-editor-types';

// White space matching regex. It matches following chars:
// \s: white space
// \u00A0: no-breaking white space
// \u200B: zero width space
// \u3000: full width space (which can come from JPN IME)
const WHITESPACE_REGEX = /[\s\u00A0\u200B\u3000]+([^\s\u00A0\u200B\u3000]*)$/i;

/**
 * The class that helps search content around a position
 */
export default class PositionContentSearcher implements IPositionContentSearcher {
    // The cached text before position that has been read so far
    private text = '';

    // The cached word before position
    private word: string = '';

    // The inline element before position
    private inlineBefore: InlineElement | null = null;

    // The inline element after position
    private inlineAfter: InlineElement | null = null;

    // The content traverser used to traverse backwards
    private traverser: IContentTraverser | null = null;

    // Backward parsing has completed
    private traversingComplete: boolean = false;

    // All inline elements before position that have been read so far
    private inlineElements: InlineElement[] = [];

    // First non-text inline before position
    private nearestNonTextInlineElement: InlineElement | null = null;

    /**
     * Create a new CursorData instance
     * @param rootNode Root node of the whole scope
     * @param position Start position
     */
    constructor(private rootNode: Node, private position: NodePosition) {}

    /**
     * Get the word before position. The word is determined by scanning backwards till the first white space, the portion
     * between position and the white space is the word before position
     * @returns The word before position
     */
    public getWordBefore(): string {
        if (!this.word) {
            this.traverse(() => this.word);
        }

        return this.word || '';
    }

    /**
     * Get the inline element before position
     * @returns The inlineElement before position
     */
    public getInlineElementBefore(): InlineElement | null {
        if (!this.inlineBefore) {
            this.traverse(null);
        }

        return this.inlineBefore;
    }

    /**
     * Get the inline element after position
     * @returns The inline element after position
     */
    public getInlineElementAfter(): InlineElement | null {
        if (!this.inlineAfter) {
            this.inlineAfter = ContentTraverser.createBlockTraverser(
                this.rootNode,
                this.position
            ).currentInlineElement;
        }

        return this.inlineAfter;
    }

    /**
     * Get X number of chars before position
     * The actual returned chars may be less than what is requested.
     * @param length The length of string user want to get, the string always ends at the position,
     * so this length determines the start position of the string
     * @returns The actual string we get as a sub string, or the whole string before position when
     * there is not enough chars in the string
     */
    public getSubStringBefore(length: number): string {
        if (this.text.length < length) {
            this.traverse(() => this.text.length >= length);
        }

        return this.text.substr(Math.max(0, this.text.length - length));
    }

    /**
     * Try to get a range matches the given text before the position
     * @param text The text to match against
     * @param exactMatch Whether it is an exact match
     * @returns The range for the matched text, null if unable to find a match
     */
    public getRangeFromText(text: string, exactMatch: boolean): Range | null {
        if (!text) {
            return null;
        }

        let startPosition: NodePosition | null = null;
        let endPosition: NodePosition | null = null;
        let textIndex = text.length - 1;

        this.forEachTextInlineElement(textInline => {
            let nodeContent = textInline.getTextContent() || '';
            let nodeIndex = nodeContent.length - 1;
            for (; nodeIndex >= 0 && textIndex >= 0; nodeIndex--) {
                if (text.charCodeAt(textIndex) == nodeContent.charCodeAt(nodeIndex)) {
                    textIndex--;

                    // on first time when end is matched, set the end of range
                    if (!endPosition) {
                        endPosition = textInline.getStartPosition().move(nodeIndex + 1);
                    }
                } else if (exactMatch || endPosition) {
                    // Mismatch found when exact match or end already match, so return since matching failed
                    return true;
                }
            }

            // when textIndex == -1, we have a successful complete match
            if (textIndex == -1) {
                startPosition = textInline.getStartPosition().move(nodeIndex + 1);
                return true;
            }

            return false;
        });

        return startPosition && endPosition && createRange(startPosition, endPosition);
    }

    /**
     * Get text section before position till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when position moves out of context etc.
     * @param stopFunc The callback stop function
     */
    public forEachTextInlineElement(callback: (textInlineElement: InlineElement) => any) {
        // We cache all text sections read so far
        // Every time when you ask for textSection, we start with the cached first
        // and resort to further reading once we exhausted with the cache
        if (!this.inlineElements.some(callback)) {
            this.traverse(callback);
        }
    }

    /**
     * Get first non textual inline element before position
     * @returns First non textual inline element before position or null if no such element exists
     */
    public getNearestNonTextInlineElement(): InlineElement | null {
        if (!this.nearestNonTextInlineElement) {
            this.traverse(() => this.nearestNonTextInlineElement);
        }

        return this.nearestNonTextInlineElement;
    }

    /**
     * Continue traversing backward till stop condition is met or begin of block is reached
     */
    private traverse(callback: null | ((inlineElement: InlineElement) => any)) {
        this.traverser =
            this.traverser || ContentTraverser.createBlockTraverser(this.rootNode, this.position);

        if (!this.traverser || this.traversingComplete) {
            return;
        }

        let previousInline = this.traverser.getPreviousInlineElement();
        while (!this.traversingComplete) {
            this.inlineBefore = this.inlineBefore || previousInline;

            if (previousInline && previousInline.isTextualInlineElement()) {
                let textContent = previousInline.getTextContent();

                // build the word before position if it is not built yet
                if (!this.word) {
                    // Match on the white space, the portion after space is on the index of 1 of the matched result
                    // (index at 0 is whole match result, index at 1 is the word)
                    let matches = WHITESPACE_REGEX.exec(textContent);
                    if (matches && matches.length == 2) {
                        this.word = matches[1] + this.text;
                    }
                }

                this.text = textContent + this.text;
                this.inlineElements.push(previousInline);

                // Check if stop condition is met
                if (callback && callback(previousInline)) {
                    break;
                }
            } else {
                this.nearestNonTextInlineElement = previousInline;
                this.traversingComplete = true;
                if (!this.word) {
                    // if parsing is done, whatever we get so far in this.cachedText should also be in this.cachedWordBeforeCursor
                    this.word = this.text;
                }

                // When a non-textual inline element, or null is seen, we consider parsing complete
                // TODO: we may need to change this if there is a future need to parse beyond text, i.e.
                // we have aaa @someone bbb<position>, and we want to read the text before @someone
                break;
            }

            previousInline = this.traverser.getPreviousInlineElement();
        }
    }
}
