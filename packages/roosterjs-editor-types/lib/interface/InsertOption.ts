import { ContentPosition } from '../enum/ContentPosition';

/**
 * Options for insertContent API
 */
export default interface InsertOption {
    /**
     * Target position
     */
    position: ContentPosition;

    /**
     * Whether need to update cursor
     */
    updateCursor: boolean;

    /**
     * Whether need to replace current selection
     */
    replaceSelection: boolean;

    /**
     * Whether need to insert the content into a new line
     */
    insertOnNewLine: boolean;

    range?: Range;
}
