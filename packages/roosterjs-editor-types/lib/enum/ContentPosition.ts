/**
 * The position. Mostly used for content insertion and traversing
 * On insertion, we will need to specify where we want the content to be placed (begin, end, selection or outside)
 * On content traversing, we will need to specify the start position of traversing
 */
const enum ContentPosition {
    /**
     * Begin of the container
     */
    Begin,

    /**
     * End of the container
     */
    End,

    /**
     * Selection start
     */
    SelectionStart,

    /**
     * Outside of editor
     */
    Outside,
}

export default ContentPosition;
