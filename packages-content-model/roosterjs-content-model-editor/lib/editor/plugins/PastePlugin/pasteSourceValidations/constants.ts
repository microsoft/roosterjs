/**
 * @internal
 */
export const enum PastePropertyNames {
    /**
     * Node attribute used to identify if the content is from Google Sheets.
     */
    GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin',

    /**
     * Name of the HTMLMeta Property that provides the Office App Source of the pasted content
     */
    PROG_ID_NAME = 'ProgId',

    /**
     * Name of the HTMLMeta Property that identifies pated content as from Excel Desktop
     */
    EXCEL_DESKTOP_ATTRIBUTE_NAME = 'xmlns:x',
}
