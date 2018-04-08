import { ContentPosition, ContentScope, PluginEvent } from 'roosterjs-editor-types';
import { ContentTraverser, InlineElement, Position, SelectionRange } from 'roosterjs-editor-dom';
import { Editor, cacheGetEventData, clearEventDataCache } from 'roosterjs-editor-core';

// White space matching regex. It matches following chars:
// \s: white space
// \u00A0: no-breaking white space
// \u200B: zero width space
// \u3000: full width space (which can come from JPN IME)
const WHITESPACE_REGEX = /[\s\u00A0\u200B\u3000]+([^\s\u00A0\u200B\u3000]*)$/i;
const EVENTDATACACHE_CURSORDATA = 'CURSORDATA';

// The class that helps parse content around cursor
export default class CursorData {
    // The cached text before cursor that has been read so far
    private text: string;

    // The cached word before cursor
    private word: string;

    // The inline element before cursor
    private inlineElement: InlineElement;

    // Backward parsing has completed
    private traversingCompleted: boolean;

    // All inline elements before cursor that have been read so far
    private inlineElements: InlineElement[] = [];

    // First non-text inline before cursor
    private nearestNonTextInlineElement: InlineElement;

    /**
     * Create a new CursorData instance
     * @param traverser The content traverser to help find data before cursor
     */
    constructor(private traverser: ContentTraverser) {}

    /**
     * Get the word before cursor. The word is determined by scanning backwards till the first white space, the portion
     * between cursor and the white space is the word before cursor
     * @returns The word before cursor
     */
    public getWordBeforeCursor(): string {
        if (!this.word) {
            this.travel(() => !!this.word);
        }

        return this.word;
    }

    /**
     * Get the inline element before cursor
     * @returns The inlineElement before cursor
     */
    public getInlineElementBeforeCursor(): InlineElement {
        if (!this.inlineElement) {
            // Just return after it moves the needle by one step
            this.travel(() => true);
        }

        return this.inlineElement;
    }

    /**
     * Get X number of chars before cursor
     * The actual returned chars may be less than what is requested.
     * @param length The length of string user want to get, the string always ends at the cursor,
     * so this length determins the start position of the string
     * @returns The actual string we get as a sub string, or the whole string before cursor when
     * there is not enough chars in the string
     */
    public getSubStringBeforeCursor(length: number): string {
        if (!this.text || this.text.length < length) {
            // The cache is not built yet or not to the point the client asked for
            this.travel(
                () =>
                    this.text &&
                    this.text.length >= length
            );
        }

        let text = this.text || '';
        return text.substr(Math.max(0, text.length - length));
    }

    /**
     * Try to get a range matches the given text before the cursor
     * @param text The text to match against
     * @param exactMatch Whether it is an exact match
     * @returns The range for the matched text, null if unable to find a match
     */
    public getRangeWithTextBeforeCursor(text: string, exactMatch: boolean): SelectionRange {
        if (!text) {
            return null;
        }

        let startPosition: Position;
        let endPosition: Position;
        let textIndex = text.length - 1;
        let endMatched = exactMatch;

        this.forEachTextInlineElement(textInline => {
            let nodeContent = textInline.getTextContent() || '';
            let nodeIndex = nodeContent.length - 1;
            for (; nodeIndex >= 0 && textIndex >= 0; nodeIndex--) {
                if (text.charCodeAt(textIndex) == nodeContent.charCodeAt(nodeIndex)) {
                    endMatched = true;
                    textIndex--;

                    // on first time when end is matched, set the end of range
                    if (!endPosition) {
                        endPosition = textInline.getStartPosition().move(nodeIndex + 1);
                    }
                } else if (exactMatch || endMatched) {
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

        // textIndex == -1 means a successful complete match
        return startPosition && endPosition ? new SelectionRange(startPosition, endPosition) : null;
    }


    /**
     * Get text section before cursor till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when cursor moves out of context etc.
     * @param callback The callback function of each inline element.
     * Return true from this callback to stop the loop
     */
    public forEachTextInlineElement(callback: (textInlineElement: InlineElement) => boolean) {
        // We cache all text sections read so far
        // Every time when you ask for textSection, we start with the cached first
        // and resort to further reading once we exhausted with the cache
        if (!this.inlineElements.some(callback)) {
            this.travel(callback);
        }
    }

    /**
     * Get first non textual inline element before cursor
     * @returns First non textutal inline element before cursor or null if no such element exists
     */
    public getNearestNonTextInlineElement(): InlineElement {
        if (!this.nearestNonTextInlineElement) {
            this.travel(() => {
                return false;
            });
        }

        return this.nearestNonTextInlineElement;
    }

    /**
     * Continue traversing backward till stop condition is met or begin of block is reached
     */
    private travel(stopFunc: (inlineElement: InlineElement) => boolean) {
        if (this.traversingCompleted || !this.traverser) {
            return;
        }

        let previousInline = this.traverser.getPreviousInlineElement();
        while (!this.traversingCompleted) {
            if (!this.inlineElement) {
                // Make sure the inline before cursor is a non-empty text inline
                this.inlineElement = previousInline;
            }
            if (previousInline && previousInline.isText()) {
                let textContent = previousInline.getTextContent();

                // build the word before cursor if it is not built yet
                if (!this.word) {
                    // Match on the white space, the portion after space is on the index of 1 of the matched result
                    // (index at 0 is whole match result, index at 1 is the word)
                    let matches = WHITESPACE_REGEX.exec(textContent);
                    if (matches && matches.length == 2) {
                        this.word = matches[1] + (this.text || '');
                    }
                }

                this.text = textContent + (this.text || '');
                this.inlineElements.push(previousInline);

                // Check if stop condition is met
                if (stopFunc && stopFunc(previousInline)) {
                    break;
                }
            } else {
                /* non-textual inline or null is seen */
                this.nearestNonTextInlineElement = previousInline;
                this.traversingCompleted = true;
                if (!this.word) {
                    // if parsing is done, whatever we get so far in this.cachedText should also be in this.cachedWordBeforeCursor
                    this.word = this.text;
                }

                // When a non-textual inline element, or null is seen, we consider parsing complete
                break;
            }

            previousInline = this.traverser.getPreviousInlineElement();
        }
    }
}

/**
 * Read CursorData from plugin event cache. If not, create one
 * @param event The plugin event, it stores the event cached data for looking up.
 * If passed as null, we will create a new cursor data
 * @param editor The editor instance
 * @returns The cursor data
 */
export function cacheGetCursorEventData(event: PluginEvent, editor: Editor): CursorData {
    return cacheGetEventData(event, EVENTDATACACHE_CURSORDATA, () => new CursorData(
        editor.getContentTraverser(
            ContentScope.Block,
            ContentPosition.SelectionStart
        )
    ));
}

/**
 * Clear the cursor data in a plugin event.
 * This is called when the cursor data is changed, e.g, the text is replace with HyperLink
 * @param event The plugin event
 */
export function clearCursorEventDataCache(event: PluginEvent) {
    clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
