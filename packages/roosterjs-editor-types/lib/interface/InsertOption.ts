import { ContentPosition } from '../enum/ContentPosition';

/**
 * Shared options for insertNode related APIs
 */
export interface InsertOptionBase {
    /**
     * Whether need to update cursor
     */
    updateCursor?: boolean;

    /**
     * Whether need to replace current selection
     */
    replaceSelection?: boolean;

    /**
     * Whether need to insert the content into a new line
     */
    insertOnNewLine?: boolean;
}

/**
 * The "basic" insertNode related ContentPositions that require no additional parameters to use.
 */
export interface InsertOptionBasic extends InsertOptionBase {
    position: ContentPosition.Begin | ContentPosition.End | ContentPosition.Outside | ContentPosition.SelectionStart;
}

/**
 * The Range varient where insertNode will opperate on a range disjointed from the current selection state.
 */
export interface InsertOptionRange extends InsertOptionBase {
    position: ContentPosition.Range;

    /**
     * The range to be targeted when insertion happens.
     */
    range: Range;
}

type InsertOption = InsertOptionBasic | InsertOptionRange;

export default InsertOption;
