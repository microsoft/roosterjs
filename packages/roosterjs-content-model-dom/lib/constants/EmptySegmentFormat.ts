import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Provide a default empty instance of segment format with all its properties
 */
export const EmptySegmentFormat: Readonly<Required<ContentModelSegmentFormat>> = {
    backgroundColor: '',
    fontFamily: '',
    fontSize: '',
    fontWeight: '',
    italic: false,
    letterSpacing: '',
    lineHeight: '',
    strikethrough: false,
    superOrSubScriptSequence: '',
    textColor: '',
    underline: false,
};
