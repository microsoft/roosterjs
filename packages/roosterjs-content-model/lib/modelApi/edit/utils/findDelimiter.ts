import { ContentModelText } from '../../../publicTypes/segment/ContentModelText';

/*
// These are unicode characters mostly from the Category Space Separator (Zs)
https://unicode.org/Public/UNIDATA/Scripts.txt

\u2000 = EN QUAD
\u2009 = THIN SPACE
\u200a = HAIR SPACE
​\u200b = ZERO WIDTH SPACE
​\u202f = NARROW NO-BREAK SPACE
\u205f​ = MEDIUM MATHEMATICAL SPACE
\u3000 = IDEOGRAPHIC SPACE
*/
const SPACES_REGEX = /[\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;
//const PUNCTUATION_REGEX = /[\.,\?!:"\(\)\[\]\\\/]/gu;
const PUNCTUATIONS = '.,?!:"()[]\\/';

/**
 * @internal
 */
export function findDelimiter(segment: ContentModelText, moveRightward: boolean): number {
    const word = segment.text;
    let offset = -1;
    if (moveRightward) {
        for (let i = 0; i < word.length; i++) {
            const char = word[i];

            if (isPunctuation(char) || isSpace(char)) {
                offset = i;
                break;
            }
        }
    } else {
        for (let i = word.length - 1; i >= 0; i--) {
            const char = word[i];

            if (isPunctuation(char) || isSpace(char)) {
                offset = i + 1;
                break;
            }
        }
    }
    return offset;
}

/**
 * @internal
 */
export function isPunctuation(char: string) {
    return PUNCTUATIONS.indexOf(char) >= 0; // PUNCTUATION_REGEX.test(char);
}

/**
 * @internal
 */
export function isSpace(char: string) {
    const code = char?.charCodeAt(0) ?? 0;
    return code == 160 || code == 32 || SPACES_REGEX.test(char);
}
