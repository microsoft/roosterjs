import { DomToModelOptionForSanitizing } from 'roosterjs-content-model-types';

export const createDefaultDomToModelContext = (): DomToModelOptionForSanitizing => {
    return {
        additionalAllowedTags: [],
        additionalDisallowedTags: [],
        additionalFormatParsers: {},
        formatParserOverride: {},
        processorOverride: {},
        styleSanitizers: {},
        attributeSanitizers: {},
        processNonVisibleElements: false,
    };
};
