/**
 * Options for customizing horizontal line resizing.
 */
export interface HorizontalLineEditOptions {
    /**
     * Color of the editing border and handles.
     * @default #DB626C
     */
    borderColor?: string;

    /**
     * Minimum outer width in pixels.
     * @default 10
     */
    minWidth?: number;

    /**
     * Minimum outer height in pixels, at least 2px to fit the gray border.
     * @default 2
     */
    minHeight?: number;

    /**
     * Optional localized accessible label for the resize handles.
     */
    resizeHandleLabel?: string;
}
