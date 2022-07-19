/**
 * Context of format, used for parse format from HTML element according to current context
 */
export interface FormatContext {
    /**
     * Whether current content is in dark mode
     */
    isDarkMode: boolean;

    /**
     * Zoom scale of the content
     */
    zoomScale: number;

    /**
     * Whether current content is from right to left
     */
    isRightToLeft: boolean;
}
