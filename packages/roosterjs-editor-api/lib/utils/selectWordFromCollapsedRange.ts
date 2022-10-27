import { isBlockElement, Position } from 'roosterjs-editor-dom';

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

//If selection is collapsed, select the whole word.
export default function selectWordFromCollapsedRange(range: Range) {
    if (range?.collapsed) {
        const pos = Position.getStart(range);
        const text = pos.node.textContent;
        if (text && !isBlockElement(pos.node)) {
            let startOffset: number = range.startOffset;
            let endOffset: number = text.length;

            //Should not select the word when:
            // 1. The is first char of the string and it is a space.
            // 2. When the cursor is between spaces.
            if (
                startOffset == 0
                    ? isSpace(text[startOffset])
                    : isSpace(text[startOffset]) && isSpace(text[startOffset - 1])
            ) {
                return;
            }

            for (let index = startOffset; index < text.length; index++) {
                if (isWordDelimiter(text[index])) {
                    endOffset = index;
                    break;
                }
            }

            const isAtEndOfWord =
                startOffset != 0 && isSpace(text[startOffset]) && !isSpace(text[startOffset - 1]);

            for (let index = isAtEndOfWord ? startOffset - 1 : startOffset; index >= 0; index--) {
                if (isWordDelimiter(text[index])) {
                    startOffset = index + 1;
                    break;
                } else if (index == 0) {
                    startOffset = 0;
                }
            }

            if (startOffset < endOffset) {
                range.setStart(pos.node, startOffset);
                range.setEnd(pos.node, endOffset);
            }
        }
    }
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
