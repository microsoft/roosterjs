import HtmlSanitizerOptions from './HtmlSanitizerOptions';
import { StringMap } from '../type/htmlSanitizerCallbackTypes';

/**
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

    /**
     * When set to true, only content inside Fragment markup (if any) will be preserved
     */
    preserveFragmentOnly?: boolean;
}
