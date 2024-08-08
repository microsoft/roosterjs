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
                const textSegment = previousSegment.text;
                const textBeforeMarker = textSegment.slice(0, -1);
                context.newPendingFormat = {
                    ...markerFormat,
                    strikethrough: !!markerFormat.strikethrough,
                    italic: !!markerFormat.italic,
                    fontWeight: markerFormat?.fontWeight ? 'bold' : undefined,
                };
                console.log(textBeforeMarker);
                if (textBeforeMarker.indexOf(character) > -1) {
                    const lastCharIndex = textSegment.length;
                    const firstCharIndex = textSegment
                        .substring(0, lastCharIndex - 1)
                        .lastIndexOf(character);

                    if (
                        hasSpaceBeforeFirstCharacter(textSegment, firstCharIndex) &&
                        lastCharIndex - firstCharIndex > 2
                    ) {
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

/**
 * The markdown should not be trigger inside a word, so whe check if exist a space before the trigger character
 * Should trigger markdown example: _one two_
 * Should not trigger markdown example: one_two_
 */
function hasSpaceBeforeFirstCharacter(text: string, index: number) {
    return !text[index - 1] || text[index - 1].trim().length == 0;
}
