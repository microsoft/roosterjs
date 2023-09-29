import type HtmlSanitizerOptions from './HtmlSanitizerOptions';
import type { StringMap } from '../type/htmlSanitizerCallbackTypes';

/**
 * @deprecated
 * Options for sanitizeHtml function
 */
export default interface SanitizeHtmlOptions extends HtmlSanitizerOptions {
    /**
     * Current HTML element, styles of this element will be used as current style values.
     * Or a string map represents current styles
     */
    currentElementOrStyle?: HTMLElement | StringMap;

    /**
     * When set to true, will only do inline CSS conversion and skip the sanitizing pass
     */
    convertCssOnly?: boolean;
}
