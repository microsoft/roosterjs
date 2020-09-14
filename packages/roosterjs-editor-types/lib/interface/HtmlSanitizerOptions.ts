import {
    ElementCallbackMap,
    AttributeCallbackMap,
    StringMap,
    StyleCallbackMap,
    PredefinedCssMap,
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
     */
    additionalAllowedAttributes?: string[];

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
     * Additional predefined CSS for element
     */
    additionalPredefinedCssForElement?: PredefinedCssMap;

    /**
     * Define a replacement tag name of unknown tags.
     * A valid non-empty string means replace the tag name with this string.
     * Empty string ('') means keep it as it is, no replacement.
     * undefined or null means drop such elements and all its children
     * @default undefined
     */
    unknownTagReplacement?: string;
}
