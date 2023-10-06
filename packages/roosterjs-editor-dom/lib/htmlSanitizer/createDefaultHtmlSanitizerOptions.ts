import type { HtmlSanitizerOptions } from 'roosterjs-editor-types';

/**
 * Create default value of HtmlSanitizerOptions with every property set
 */
export default function createDefaultHtmlSanitizerOptions(): Required<HtmlSanitizerOptions> {
    return {
        elementCallbacks: {},
        attributeCallbacks: {},
        cssStyleCallbacks: {},
        additionalTagReplacements: {},
        additionalAllowedAttributes: [],
        additionalAllowedCssClasses: [],
        additionalDefaultStyleValues: {},
        additionalGlobalStyleNodes: [],
        additionalPredefinedCssForElement: {},
        preserveHtmlComments: false,
        unknownTagReplacement: null,
    };
}
