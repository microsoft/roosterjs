import {
    ElementCallbackMap,
    AttributeCallbackMap,
    StringMap,
    StyleCallbackMap,
} from '../type/htmlSanitizerCallbackTypes';

/**
 * Options for HtmlSanitizer
 */
export default interface HtmlSanitizerOptions {
    /**
     * Callbacks for HTML elements
     */
    elementCallbacks?: ElementCallbackMap;

    /**
     * Callbacks for HTML attributes
     */
    attributeCallbacks?: AttributeCallbackMap;

    /**
     * Callbacks for CSS styles
     */
    styleCallbacks?: StyleCallbackMap;

    /**
     * Allowed HTML tags in addition to default tags, in upper case
     */
    additionalAllowedTags?: string[];

    /**
     * Allowed HTML attributes in addition to default attributes, in lower case
     * TODO: rename to "additionalAllowedAttributes" in next major release
     */
    additionalAllowAttributes?: string[];

    /**
     * Allowed CSS Class names
     */
    additionalAllowedCssClasses?: string[];

    /**
     * CSS style default values in addition to the default value map, style name should be in lower case
     */
    additionalDefaultStyleValues?: StringMap;

    /**
     * Additional global CSS style nodes
     */
    additionalGlobalStyleNodes?: HTMLStyleElement[];

    /**
     * Whether allow CSS white-space in result
     */
    allowPreserveWhiteSpace?: boolean;
}
