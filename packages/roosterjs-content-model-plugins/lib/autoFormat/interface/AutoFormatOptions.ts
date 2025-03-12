import type { AutoLinkOptions } from 'roosterjs-content-model-types';

/**
 * Options to customize the Content Model Auto Format Plugin
 */
export interface AutoFormatOptions extends AutoLinkOptions {
    /**
     * When true, after type *, ->, -, --, => , —, > and space key a type of bullet list will be triggered.
     */
    autoBullet?: boolean;

    /**
     * When true, after type 1, A, a, i, I followed by ., ), - or between () and space key a type of numbering list will be triggered.
     */
    autoNumbering?: boolean;

    /**
     * Transform -- into hyphen, if typed between two words
     */
    autoHyphen?: boolean;

    /**
     * Transform 1/2, 1/4, 3/4 into fraction character
     */
    autoFraction?: boolean;

    /**
     * Transform ordinal numbers into superscript
     */
    autoOrdinals?: boolean;

    /**
     * Remove the margins of auto triggered list
     */
    removeListMargins?: boolean;

    /**
     * Auto Horizontal line
     */
    autoHorizontalLine?: boolean;
}
