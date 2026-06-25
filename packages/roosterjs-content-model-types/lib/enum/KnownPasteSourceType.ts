/**
 * Represent the known types of sources of pasted content, detected from the clipboard data
 */
export type KnownPasteSourceType =
    /**
     * Content copied from Word Desktop
     */
    | 'wordDesktop'

    /**
     * Content copied from Excel Desktop
     */
    | 'excelDesktop'

    /**
     * Content copied from Excel Online
     */
    | 'excelOnline'

    /**
     * Content copied from PowerPoint Desktop
     */
    | 'powerPointDesktop'

    /**
     * Content copied from Google Sheets
     */
    | 'googleSheets'

    /**
     * Content copied from Word/OneNote Online (WAC components)
     */
    | 'wacComponents'

    /**
     * Default source, when no known source is detected
     */
    | 'default'

    /**
     * Content that only contains a single image
     */
    | 'singleImage'

    /**
     * Content copied from Excel using a non-native event
     */
    | 'excelNonNativeEvent'

    /**
     * Content copied from OneNote Desktop
     */
    | 'oneNoteDesktop';
