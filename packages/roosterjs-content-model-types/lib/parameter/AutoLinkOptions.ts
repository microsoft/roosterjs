/**
 * Options to customize the Auto link options in Auto Format Plugin
 */
export interface AutoLinkOptions {
    /**
     * When press backspace before a link, remove the hyperlink
     */
    autoUnlink?: boolean;

    /**
     * When paste or type content with a link, create hyperlink for the link
     */
    autoLink?: boolean;

    /**
     * When paste content or type content with telephone, create hyperlink for the telephone number
     */
    autoTel?: boolean;

    /**
     * When paste or type a content with mailto, create hyperlink for the content
     */
    autoMailto?: boolean;
}
