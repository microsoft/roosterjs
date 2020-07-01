import { HtmlSanitizerOptions } from 'roosterjs-editor-types';

/**
 * Create default value of HtmlSanitizerOptions with every property set
 */
export default function createDefaultHtmlSanitizerOptions(): Required<HtmlSanitizerOptions> {
    return {
        elementCallbacks: {},
        attributeCallbacks: {},
        styleCallbacks: {},
        additionalAllowedTags: [],
        additionalAllowAttributes: [],
        additionalAllowedCssClasses: [],
        additionalDefaultStyleValues: {},
        additionalGlobalStyleNodes: [],
        allowPreserveWhiteSpace: false,
    };
}
