import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const EmptySegmentFormat: Required<ContentModelSegmentFormat> = {
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
