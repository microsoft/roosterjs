/**
 * Prefix of content types
 */
export const enum ContentTypePrefix {
    /**
     * Text type prefix
     */
    Text = 'text/',

    /**
     * Image type prefix
     */
    Image = 'image/',
}

/**
 * Known content types
 */
export const enum ContentType {
    /**
     * Plain text content type
     */
    PlainText = ContentTypePrefix.Text + 'plain',

    /**
     * HTML content type
     */
    HTML = ContentTypePrefix.Text + 'html',
}
