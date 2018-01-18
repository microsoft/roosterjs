import { ContentPosition, ContentScope, InlineElement, TextSection } from 'roosterjs-editor-types';
import { ContentTraverser, isTextualInlineElement, matchWhiteSpaces } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

// The class that helps parse content around cursor
export default class CursorData {
    // The cached text before cursor that has been read so far
    private cachedTextBeforeCursor: string;

    // The cached word before cursor
    private cachedWordBeforeCursor: string;

    // The inline element before cursor
    private inlineBeforeCursor: InlineElement;

    // The inline element after cursor
    private inlineAfterCursor: InlineElement;

    // The content traverser used to traverse backwards
    private backwardTraverser: ContentTraverser;

    /// The content traverser used to traverse forward
    private forwardTraverser: ContentTraverser;

    // Backward parsing has completed
    private backwardTraversingComplete: boolean;

    // Forward traversing has completed
    private forwardTraversingComplete: boolean;

    // All text sections before cursor that have been read so far
    private textsBeforeCursor: TextSection[];

    /**
     * Create a new CursorData instance
     * @param editor The editor instance
     */
    constructor(private editor: Editor) {}

    /**
     * Get the word before cursor. The word is determined by scanning backwards till the first white space, the portion
     * between cursor and the white space is the word before cursor
     * @returns The word before cursor
     */
    public get wordBeforeCursor(): string {
        if (!this.cachedWordBeforeCursor && !this.backwardTraversingComplete) {
            this.continueTraversingBackwardTill((textSection: TextSection): boolean => {
                return this.cachedWordBeforeCursor != null;
            });
        }

        return this.cachedWordBeforeCursor;
    }

    /**
     * Get the inline element before cursor
     * @returns The inlineElement before cursor
     */
    public get inlineElementBeforeCursor(): InlineElement {
        if (!this.inlineBeforeCursor && !this.backwardTraversingComplete) {
            // Just return after it moves the needle by one step
            this.continueTraversingBackwardTill((textSection: TextSection): boolean => {
                return true;
            });
        }

        return this.inlineBeforeCursor;
    }

    /**
     * Get the inline element after cursor
     * @returns The inline element after cursor
     */
    public get inlineElementAfterCursor(): InlineElement {
        if (!this.inlineAfterCursor && !this.forwardTraversingComplete) {
            // TODO: this may needs to be extended to support read more than just one inline element after cursor
            if (!this.forwardTraverser) {
                this.forwardTraverser = this.editor.getContentTraverser(
                    ContentScope.Block,
                    ContentPosition.SelectionStart
                );
            }

            if (this.forwardTraverser) {
                this.inlineAfterCursor = this.forwardTraverser.currentInlineElement;
            }

            // Set traversing to be complete once we read
            this.forwardTraversingComplete = true;
        }

        return this.inlineAfterCursor;
    }

    /**
     * Get X number of chars before cursor
     * The actual returned chars may be less than what is requested. e.g, length of text before cursor is less then X
     * @param numChars The X number of chars user want to get
     * @returns The actual chars we get as a string
     */
    public getXCharsBeforeCursor(numChars: number): string {
        if (
            (!this.cachedTextBeforeCursor || this.cachedTextBeforeCursor.length < numChars) &&
            !this.backwardTraversingComplete
        ) {
            // The cache is not built yet or not to the point the client asked for
            this.continueTraversingBackwardTill((textSection: TextSection): boolean => {
                return (
                    this.cachedTextBeforeCursor != null &&
                    this.cachedTextBeforeCursor.length >= numChars
                );
            });
        }

        if (this.cachedTextBeforeCursor) {
            return this.cachedTextBeforeCursor.length >= numChars
                ? this.cachedTextBeforeCursor.substr(this.cachedTextBeforeCursor.length - numChars)
                : this.cachedTextBeforeCursor;
        } else {
            return '';
        }
    }

    /**
     * Get text section before cursor till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when cursor moves out of context etc.
     * @param stopFunc The callback stop function
     */
    public getTextSectionBeforeCursorTill(stopFunc: (textSection: TextSection) => boolean) {
        // We cache all text sections read so far
        // Every time when you ask for textSection, we start with the cached first
        // and resort to further reading once we exhausted with the cache
        let shouldStop = false;
        if (this.textsBeforeCursor && this.textsBeforeCursor.length > 0) {
            for (let i = 0; i < this.textsBeforeCursor.length; i++) {
                shouldStop = stopFunc(this.textsBeforeCursor[i]);
                if (shouldStop) {
                    break;
                }
            }
        }

        // The cache does not completely fulfill the need, resort to extra parsing
        if (!shouldStop && !this.backwardTraversingComplete) {
            this.continueTraversingBackwardTill(stopFunc);
        }
    }

    /// Continue traversing backward till stop condition is met or begin of block is reached
    private continueTraversingBackwardTill(stopFunc: (textSection: TextSection) => boolean) {
        if (!this.backwardTraverser) {
            this.backwardTraverser = this.editor.getContentTraverser(
                ContentScope.Block,
                ContentPosition.SelectionStart
            );
        }

        if (!this.backwardTraverser) {
            return;
        }

        let previousInline = this.backwardTraverser.getPreviousInlineElement();
        while (!this.backwardTraversingComplete) {
            if (previousInline && isTextualInlineElement(previousInline)) {
                let textContent = previousInline.getTextContent();
                if (!this.inlineBeforeCursor) {
                    // Make sure the inline before cursor is a non-empty text inline
                    this.inlineBeforeCursor = previousInline;
                }

                // build the word before cursor if it is not built yet
                if (!this.cachedWordBeforeCursor) {
                    // Match on the white space, the portion after space is on the index of 1 of the matched result
                    // (index at 0 is whole match result, index at 1 is the word)
                    let matches = matchWhiteSpaces(textContent);
                    if (matches && matches.length == 2) {
                        this.cachedWordBeforeCursor = matches[1];
                        // if this.cachedTextBeforeCursor is not null, what we get is just a portion of it, need to append this.cachedTextBeforeCursor
                        if (this.cachedTextBeforeCursor) {
                            this.cachedWordBeforeCursor =
                                this.cachedWordBeforeCursor + this.cachedTextBeforeCursor;
                        }
                    }
                }

                this.cachedTextBeforeCursor = !this.cachedTextBeforeCursor
                    ? textContent
                    : textContent + this.cachedTextBeforeCursor;

                // We have a new TextSection, remember it by pushing it to this.textsBeforeCursor array
                let newSection = {
                    wholeText: this.cachedTextBeforeCursor,
                    inlineElement: previousInline,
                };
                if (!this.textsBeforeCursor) {
                    this.textsBeforeCursor = [newSection];
                } else {
                    this.textsBeforeCursor.push(newSection);
                }

                // Check if stop condition is met
                if (stopFunc && stopFunc(newSection)) {
                    break;
                }
            } else {
                /* non-textual inline or null is seen */
                if (!this.inlineBeforeCursor) {
                    // When we're here, it means we first hit a non-text inline node
                    // Make sure to set inlineBeforeCursor if it is not set
                    this.inlineBeforeCursor = previousInline;
                }

                this.backwardTraversingComplete = true;
                if (!this.cachedWordBeforeCursor) {
                    // if parsing is done, whatever we get so far in this.cachedText should also be in this.cachedWordBeforeCursor
                    this.cachedWordBeforeCursor = this.cachedTextBeforeCursor;
                }

                // When a non-textual inline element, or null is seen, we consider parsing complete
                // TODO: we may need to change this if there is a future need to parse beyond text, i.e.
                // we have aaa @someone bbb<cursor>, and we want to read the text before @someone
                break;
            }

            previousInline = this.backwardTraverser.getPreviousInlineElement();
        }
    }
}
