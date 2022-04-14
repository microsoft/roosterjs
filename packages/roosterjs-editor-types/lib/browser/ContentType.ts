/**
 * Prefix of content types
 */
export enum ContentTypePrefix {
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
export enum ContentType {
    /**
     * Plain text content type
     */
    PlainText = ContentTypePrefix.Text + 'plain',

    /**
     * HTML content type
     */
    HTML = ContentTypePrefix.Text + 'html',
}
