/**
 * Possible clipboard sources that have a different strategy when performing the Paste Event
 * This attributes are retrieved from the meta tags if the ClipboardData contains RawHtml
 */
export const enum ClipboardSource {
    /**
     * Key attribute of a Meta element that indicates the content is being copied from Word
     */
    WORD_ATTRIBUTE_NAME = 'xmlns:w',

    /**
     *  Content attribute of a Meta element that indicates the content is being copied from Word
     */
    WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word',

    /**
     * Key attribute of a Meta element that indicates the content is being copied from Excel
     */
    EXCEL_ATTRIBUTE_NAME = 'xmlns:x',

    /**
     *  Content attribute of a Meta element that indicates the content is being copied from Excel
     */
    EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel',

    /**
     * Key attribute of a Meta element that indicates the content is being copied from Word
     */
    PROG_ID_NAME = 'ProgId',

    /**
     *  Content attribute of a Meta element that indicates the content is being copied from Excel Online
     */
    EXCEL_ONLINE_ATTRIBUTE_VALUE = 'Excel.Sheet',

    /**
     * Content attribute of a Meta element that indicates the content is being copied from Power Point
     */
    POWERPOINT_ATTRIBUTE_VALUE = 'PowerPoint.Slide',

    /**
     *  Key attribute of a Meta element that indicates the content is being copied from Google Sheets
     */
    GOOGLE_SHEET_NODE_NAME = 'google-sheets-html-origin',
}
