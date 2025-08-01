/**
 * The mode parameter type for exportContent API
 */
export type ExportContentMode =
    /**
     * Export to clean HTML in light color mode with dehydrated entities
     */
    | 'HTML'

    /**
     * Export to clean HTML in light color mode with dehydrated entities.
     * This is a fast version, it retrieve HTML content directly from editor without going through content model conversion.
     */
    | 'HTMLFast'

    /**
     * Export to plain text
     */
    | 'PlainText'

    /**
     * Export to plain text via browser's textContent property
     */
    | 'PlainTextFast';
