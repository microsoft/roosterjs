/**
 * A handler type to convert HTML string to a trust HTML string
 */
export type LegacyTrustedHTMLHandler = (html: string) => string;

/**
 * A handler type to convert HTML string to a DOM object
 */
export interface DOMCreator {
    htmlToDOM: (html: string) => Document;
}

/**
 * A handler type to convert HTML string to a trust HTML string or a DOM object
 */
export type TrustedHTMLHandler = DOMCreator | LegacyTrustedHTMLHandler;
