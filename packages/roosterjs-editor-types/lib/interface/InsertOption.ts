import { ContentPosition } from '../enum/ContentPosition';

/**
 * Shared options for insertNode related APIs
 */
export interface InsertOptionBase {
    /**
     * Whether need to update cursor.
     */
    updateCursor?: boolean;

    /**
     * Boolean flag for inserting the content onto a new line.
     * No-op for ContentPosition.Outside
     */
    insertOnNewLine?: boolean;

    /**
     * Boolean flag for inserting the content onto a new line.
     * No-op for ContentPosition.Begin, End, and Outside
     */
    replaceSelection?: boolean;
}

/**
 * The "basic" insertNode related ContentPositions that require no additional parameters to use.
 */
export interface InsertOptionBasic extends InsertOptionBase {
    position:
        | ContentPosition.Begin
        | ContentPosition.End
        | ContentPosition.DomEnd
        | ContentPosition.Outside
        | ContentPosition.SelectionStart;
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

/**
 * Type definition for the InsertOption, used in the insertNode API.
 * The position parameter defines how the node will be inserted.
 * In a future revision, this will become strongly typed
 * Only parameters applicable to the given position will be accepted.
 */
export type InsertOption = InsertOptionRange | InsertOptionBasic;
