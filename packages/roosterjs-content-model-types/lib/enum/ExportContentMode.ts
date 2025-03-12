/**
 * The mode parameter type for exportContent API
 */
export type ExportContentMode =
    /**
     * Export to clean HTML in light color mode with dehydrated entities
     */
    | 'HTML'

    /**
     * Export to plain text
     */
    | 'PlainText'

    /**
     * Export to plain text via browser's textContent property
     */
    | 'PlainTextFast'

    /**
     * Export editor innerHTML
     */
    | 'CleanHTML';
