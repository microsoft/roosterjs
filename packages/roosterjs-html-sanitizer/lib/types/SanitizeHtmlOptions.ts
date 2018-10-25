import HtmlSanitizerOptions from './HtmlSanitizerOptions';
import { StringMap } from '../types/maps';

/**
 * Options for sanitizeHtml function
 */
interface SanitizeHtmlOptions extends HtmlSanitizerOptions {
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

export default SanitizeHtmlOptions;
