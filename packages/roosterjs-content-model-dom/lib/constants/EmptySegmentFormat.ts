import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

/**
 * Provide a default empty instance of segment format with all its properties.
 * Note: "dataValue" is intentionally excluded since it represents the value of a specific
 * HTML "data" element and should not be carried over to other segments (e.g. selection markers
 * or pending format).
 */
export const EmptySegmentFormat: Readonly<Required<
    Omit<ContentModelSegmentFormat, 'dataValue'>
>> = {
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
