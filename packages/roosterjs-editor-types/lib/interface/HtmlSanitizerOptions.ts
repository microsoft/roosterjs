import {
    AttributeCallbackMap,
    CssStyleCallbackMap,
    ElementCallbackMap,
    PredefinedCssMap,
    StringMap,
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
    cssStyleCallbacks?: CssStyleCallbackMap;

    /**
     * Additional tag replacement, to allow replace a tag to another name, or remove it.
     *
     * The value can be:
     * '*': Keep this element with no change
     * '<A valid tag name>: Keep this element but change its tag to the given value
     * null: Remove this element
     *
     * For other unknown tags, we will respect the value of unknownTagReplacement with the same meaning
     */
    additionalTagReplacements?: Record<string, string | null>;

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
     * Preserve HTML comments
     */
    preserveHtmlComments?: boolean;

    /**
     * Define a replacement tag name of unknown tags.
     * A star "*" means keep as it is, no replacement
     * Other valid string means replace the tag name with this string.
     * Empty string, undefined means drop such elements and all its children
     * @default undefined
     */
    unknownTagReplacement?: string | null;
}
