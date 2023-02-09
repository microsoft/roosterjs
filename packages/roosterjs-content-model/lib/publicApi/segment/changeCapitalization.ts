import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Change the capitalization of text in the selection
 * @param editor The editor instance
 * @param capitalization The case option
 * @param language Optional parameter for language string that should comply to "IETF BCP 47 Tags for
 * Identifying Languages". For example: 'en' or 'en-US' for English, 'tr' for Turkish.
 * Default is the host environment’s current locale.
 */
export default function changeCapitalization(
    editor: IContentModelEditor,
    capitalization: 'sentence' | 'lowerCase' | 'upperCase' | 'capitalize',
    language?: string
) {
    formatSegmentWithContentModel(editor, 'changeCapitalization', (_, __, segment) => {
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

                    for (let i = 0; i < wordArray.length; i++) {
                        wordArray[i] =
                            wordArray[i].charAt(0).toLocaleUpperCase(language) +
                            wordArray[i].slice(1);
                    }

                    segment.text = wordArray.join(' ');
                    break;

                case 'sentence':
                    // TODO: Add rules on punctuation for internationalization - TASK 104769
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
