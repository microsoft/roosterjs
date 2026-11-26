import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Provide a default empty instance of segment format with all its properties
 */
export const EmptySegmentFormat: Readonly<Required<ContentModelSegmentFormat>> = {
    backgroundColor: '',
    fontFamily: '',
    fontFeatureSettings: '',
    fontSize: '',
    fontVariantLigatures: '',
    fontWeight: '',
    italic: false,
    letterSpacing: '',
    lineHeight: '',
    strikethrough: false,
    superOrSubScriptFontSize: '',
    superOrSubScriptSequence: '',
    textColor: '',
    underline: false,
    wordContextualAlternates: '',
};
