import type { ContentModelSegmentFormat } from 'roosterjs-content-model-types';

const EmptySegmentFormat: Required<ContentModelSegmentFormat> = {
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

/**
 * @internal
 */
export function generatePendingFormat(
    defaultFormat: ContentModelSegmentFormat | undefined,
    currentFormat?: ContentModelSegmentFormat
): ContentModelSegmentFormat | undefined {
    return currentFormat
        ? {
              ...EmptySegmentFormat, // Use empty format as initial value to clear any other format inherits from pasted content
              ...defaultFormat,
              ...currentFormat,
          }
        : undefined;
}
