import { cacheGetEventData, clearEventDataCache, Editor } from 'roosterjs-editor-core';
import { InlineElement, PluginEvent } from 'roosterjs-editor-types';
import { PositionContentSearcher } from 'roosterjs-editor-dom';

const EVENTDATACACHE_CURSORDATA = 'CURSORDATA';

/**
 * @deprecated Use PositionContentSearcher instead
 */
export default class CursorData {
    private searcher: PositionContentSearcher;
    /**
     * Create a new CursorData instance
     * @param editor The editor instance
     */
    constructor(editor: Editor) {
        this.searcher = editor.getContentSearcherOfCursor();
    }

    public getContentSearcher() {
        return this.searcher;
    }

    /**
     * Get the word before cursor. The word is determined by scanning backwards till the first white space, the portion
     * between cursor and the white space is the word before cursor
     * @returns The word before cursor
     */
    public get wordBeforeCursor(): string {
        return this.searcher.getWordBefore();
    }

    /**
     * Get the inline element before cursor
     * @returns The inlineElement before cursor
     */
    public get inlineElementBeforeCursor(): InlineElement {
        return this.searcher.getInlineElementBefore();
    }

    /**
     * Get the inline element after cursor
     * @returns The inline element after cursor
     */
    public get inlineElementAfterCursor(): InlineElement {
        return this.searcher.getInlineElementAfter();
    }

    /**
     * Get X number of chars before cursor
     * The actual returned chars may be less than what is requested. e.g, length of text before cursor is less then X
     * @param numChars The X number of chars user want to get
     * @returns The actual chars we get as a string
     */
    public getXCharsBeforeCursor(numChars: number): string {
        return this.searcher.getSubStringBefore(numChars);
    }

    /**
     * Get text section before cursor till stop condition is met.
     * This offers consumers to retrieve text section by section
     * The section essentially is just an inline element which has Container element
     * so that the consumer can remember it for anchoring popup or verification purpose
     * when cursor moves out of context etc.
     * @param stopFunc The callback stop function
     */
    public getTextSectionBeforeCursorTill(stopFunc: (textInlineElement: InlineElement) => boolean) {
        return this.searcher.forEachTextInlineElement(stopFunc);
    }

    /**
     * Get first non textual inline element before cursor
     * @returns First non textutal inline element before cursor or null if no such element exists
     */
    public getFirstNonTextInlineBeforeCursor(): InlineElement {
        return this.searcher.getNearestNonTextInlineElement();
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
    return cacheGetEventData<CursorData>(
        event,
        EVENTDATACACHE_CURSORDATA,
        () => new CursorData(editor)
    );
}

/**
 * Clear the cursor data in a plugin event.
 * This is called when the cursor data is changed, e.g, the text is replace with HyperLink
 * @param event The plugin event
 */
export function clearCursorEventDataCache(event: PluginEvent) {
    clearEventDataCache(event, EVENTDATACACHE_CURSORDATA);
}
