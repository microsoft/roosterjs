import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type {
    IEditor,
    ShallowMutableContentModelParagraph,
    ShallowMutableContentModelSegment,
} from 'roosterjs-content-model-types';

/**
 * Change the capitalization of text in the selection
 * @param editor The editor instance
 * @param capitalization The case option
 * @param language Optional parameter for language string that should comply to "IETF BCP 47 Tags for
 * Identifying Languages". For example: 'en' or 'en-US' for English, 'tr' for Turkish.
 * Default is the host environment’s current locale.
 */
export function changeCapitalization(
    editor: IEditor,
    capitalization: 'sentence' | 'lowerCase' | 'upperCase' | 'capitalize',
    language?: string
) {
    editor.focus();

    formatSegmentWithContentModel(editor, 'changeCapitalization', (_, __, segment, paragraph) => {
        if (segment?.segmentType == 'Text') {
            switch (capitalization) {
                case 'lowerCase':
                    segment.text = segment.text.toLocaleLowerCase(language);
                    break;

                case 'upperCase':
                    segment.text = segment.text.toLocaleUpperCase(language);
                    break;

                case 'capitalize':
                    const wordArray = segment.text.toLocaleLowerCase(language).split(' ');

                    // When a collapsed selection is in the middle of a word, the word is split
                    // into multiple text segments around the selection marker. In that case the
                    // first segment of the word continues from a previous segment, so its first
                    // word must not be capitalized to avoid results like "HeLlo" for "he|llo".
                    const precedingChar = getPrecedingCharacter(paragraph, segment);
                    const startIndex = precedingChar && precedingChar != ' ' ? 1 : 0;

                    for (let i = startIndex; i < wordArray.length; i++) {
                        wordArray[i] =
                            wordArray[i].charAt(0).toLocaleUpperCase(language) +
                            wordArray[i].slice(1);
                    }

                    segment.text = wordArray.join(' ');
                    break;

                case 'sentence':
                    const punctuationMarks = '[\\.\\!\\?]';
                    // Find a match of a word character either:
                    // - At the beginning of a string with or without preceding whitespace, for
                    // example: '  hello world' and 'hello world' strings would both match 'h'.
                    // - Or preceded by a punctuation mark and at least one whitespace, for
                    // example 'yes. hello world' would match 'y' and 'h'.
                    const regex = new RegExp('^\\s*\\w|' + punctuationMarks + '\\s+\\w', 'g');

                    segment.text = segment.text
                        .toLocaleLowerCase(language)
                        .replace(regex, match => match.toLocaleUpperCase(language));
                    break;
            }
        }
    });
}

/**
 * Get the character immediately preceding the given segment within its paragraph, skipping
 * selection markers (which carry no text). Returns an empty string if there is no preceding
 * text character (e.g. the segment starts the paragraph or follows a non-text segment).
 */
function getPrecedingCharacter(
    paragraph: ShallowMutableContentModelParagraph | null,
    segment: ShallowMutableContentModelSegment
): string {
    if (!paragraph) {
        return '';
    }

    const index = paragraph.segments.indexOf(segment);

    for (let i = index - 1; i >= 0; i--) {
        const previous = paragraph.segments[i];

        if (previous.segmentType == 'SelectionMarker') {
            continue;
        } else if (previous.segmentType == 'Text' && previous.text.length > 0) {
            return previous.text[previous.text.length - 1];
        } else {
            break;
        }
    }

    return '';
}
