import { HtmlSanitizer } from 'roosterjs-html-sanitizer';

/**
 * Callback function set for sanitizeHtml().
 * sanitizeHtml() will check if there is a callback function for a given property name,
 * it will call this function to decide what value to set for this property.
 * Return null will cause this property be deleted, otherwise return the value of the property
 */
export type SanitizeHtmlPropertyCallback = { [name: string]: (value: string) => string };

/**
 * A map from CSS style name to its value
 */
export type StyleMap = { [name: string]: string };

/**
 * @deprecated Use HtmlSanitizer.sanitizeHtml from roosterjs-html-sanitizer instead
 * Sanitize HTML string
 * This function will do the following work:
 * 1. Convert global CSS into inline CSS
 * 2. Remove dangerous HTML tags and attributes
 * 3. Remove useless CSS properties
 * @param html The input HTML
 * @param additionalStyleNodes additional style nodes for inline css converting
 * @param convertInlineCssOnly Whether only convert inline css and skip html content sanitizing
 * @param propertyCallbacks A callback function map to handle HTML properties
 * @param preserveFragmentOnly If set to true, only preserve the html content between <!--StartFragment--> and <!--Endfragment-->
 */
export default function sanitizeHtml(
    html: string,
    additionalStyleNodes?: HTMLStyleElement[],
    convertInlineCssOnly?: boolean,
    propertyCallbacks?: SanitizeHtmlPropertyCallback,
    preserveFragmentOnly?: boolean,
    currentStyle?: StyleMap
): string {
    return HtmlSanitizer.sanitizeHtml(html, {
        additionalGlobalStyleNodes: additionalStyleNodes,
        convertCssOnly: convertInlineCssOnly,
        attributeCallbacks: propertyCallbacks,
        currentElementOrStyle: currentStyle,
        preserveFragmentOnly,
    });
}
