import { ContentModelText } from '../../publicTypes/segment/ContentModelText';
import { createText } from '../../modelApi/creators/createText';

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

export function findDelimiter(segment: ContentModelText, moveRightward: boolean): number | null {
    const word = segment.text;
    let offset = null;
    if (moveRightward) {
        for (let i = 0; i < word.length; i++) {
            if (isWordDelimiter(word[i])) {
                offset = i;
                break;
            }
        }
    } else {
        for (let i = word.length - 1; i >= 0; i--) {
            if (isWordDelimiter(word[i])) {
                offset = i + 1;
                break;
            }
        }
    }
    return offset;
}

export function splitTextSegment(segments: ContentModelText[], index: number, found: number) {
    const segment1 = createText(segments[index].text.substring(0, found));
    const segment2 = createText(segments[index].text.substring(found, segments[index].text.length));

    segments.splice(index, 1, segment2);
    segments.splice(index, 0, segment1);
}

function isWordDelimiter(char: string) {
    return PUNCTUATION_REGEX.test(char) || isSpace(char);
}

function isSpace(char: string) {
    return (
        char &&
        (char.toString() == String.fromCharCode(160) /* &nbsp */ ||
        char.toString() == String.fromCharCode(32) /* RegularSpace */ ||
            SPACES_REGEX.test(char))
    );
}
