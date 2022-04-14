/**
 * Represents a mode number to indicate what kind of content to retrieve when call Editor.getContent()
 */
export enum GetContentMode {
    /**
     * The clean content without any temporary content only for editor.
     * This is the default value. Call to Editor.getContent() with trigger an ExtractContentWithDom event
     * so that plugins can remove their temporary content, and will return the HTML content
     * which is ready for save to storage.
     */
    CleanHTML = 0,

    /**
     * Retrieve the raw HTML string in current editor. Temporary content will be included.
     */
    RawHTMLOnly = 1,

    /**
     * Retrieve the raw HTML string in current editor with a selection marker. This can be used for
     * save current editor state and call to SetContent with this result can fully restore editor state
     * including current selection
     */
    RawHTMLWithSelection = 2,

    /**
     * Get plain text content only, all format will be ignored
     */
    PlainText,

    /**
     * A fast way to get plain text content, the line-end positions may not be exactly same with HTML content,
     * but the text content should be the same. This is used for quickly retrieve text content and check
     * text only
     */
    PlainTextFast,
}
