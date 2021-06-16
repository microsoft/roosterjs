/**
 * Prefix of content types
 */
export const enum ContentTypePrefix {
    /**
     * Text type prefix
     */
    TextTypePrefix = 'text/',

    /**
     * Image type prefix
     */
    ImageTypePrefix = 'image/',
}

/**
 * Known content types
 */
export const enum ContentType {
    /**
     * Plain text content type
     */
    PlainTextType = ContentTypePrefix.TextTypePrefix + 'plain',

    /**
     * HTML content type
     */
    HtmlType = ContentTypePrefix.TextTypePrefix + 'html',
}
