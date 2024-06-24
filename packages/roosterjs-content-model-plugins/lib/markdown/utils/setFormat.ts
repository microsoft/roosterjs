import {
    formatTextSegmentBeforeSelectionMarker,
    splitTextSegment,
} from 'roosterjs-content-model-api';
import type {
    ContentModelCodeFormat,
    ContentModelSegmentFormat,
    IEditor,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function setFormat(
    editor: IEditor,
    character: string,
    format: ContentModelSegmentFormat,
    codeFormat?: ContentModelCodeFormat
) {
    formatTextSegmentBeforeSelectionMarker(
        editor,
        (_model, previousSegment, paragraph, markerFormat, context) => {
            if (previousSegment.text[previousSegment.text.length - 1] == character) {
                const textBeforeMarker = previousSegment.text.slice(0, -1);
                context.newPendingFormat = {
                    ...markerFormat,
                    strikethrough: !!markerFormat.strikethrough,
                    italic: !!markerFormat.italic,
                    fontWeight: markerFormat?.fontWeight ? 'bold' : undefined,
                };
                if (textBeforeMarker.indexOf(character) > -1) {
                    const lastCharIndex = previousSegment.text.length;
                    const firstCharIndex = previousSegment.text
                        .substring(0, lastCharIndex - 1)
                        .lastIndexOf(character);
                    if (lastCharIndex - firstCharIndex > 2) {
                        const formattedText = splitTextSegment(
                            previousSegment,
                            paragraph,
                            firstCharIndex,
                            lastCharIndex
                        );

                        formattedText.text = formattedText.text.replace(character, '').slice(0, -1);
                        formattedText.format = {
                            ...formattedText.format,
                            ...format,
                        };
                        if (codeFormat) {
                            formattedText.code = {
                                format: codeFormat,
                            };
                        }

                        context.canUndoByBackspace = true;
                        return true;
                    }
                }
            }
            return false;
        }
    );
}
