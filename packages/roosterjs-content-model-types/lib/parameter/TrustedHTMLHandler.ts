/**
 * @deprecated Use DOMCreator instead
 * A handler type to convert HTML string to a trust HTML string
 */
export type LegacyTrustedHTMLHandler = (html: string) => string;

/**
 * A handler type to convert HTML string to a DOM object
 */
export interface DOMCreator {
    /**
     * Callback to convert HTML string to a DOM object
     */
    htmlToDOM: (html: string) => Document;

    /**
     * Flag to indicate if this handler is bypassed or not.
     * If this is true, it means that when converting HTML string to DOM object, we don't need to do any conversion.
     */
    isBypassed?: boolean;
}

/**
 * A handler type to convert HTML string to a trust HTML string or a DOM object
 */
export type TrustedHTMLHandler = DOMCreator | LegacyTrustedHTMLHandler;
