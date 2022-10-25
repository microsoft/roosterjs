import { ContentPosition, IEditor, InlineElement } from 'roosterjs-editor-types/lib';
import { isBlockElement, Position } from 'roosterjs-editor-dom';

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

//If selection is collapsed, select the whole word.
export default function selectWordFromCollapsedRange(range: Range, editor: IEditor) {
    if (range?.collapsed) {
        const pos = Position.getStart(range);
        const text = pos.node.textContent;
        //console.log(pos)
        //debugger
        if (text && !isBlockElement(pos.node)) {
            let startOffset: number = range.startOffset;
            //let endOffset: number = text.length;

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

            const leftTraverser = editor.getBlockTraverser();
            const rightTraverser = editor.getBlockTraverser();

            console.log(leftTraverser, rightTraverser);
            debugger;

            let inLine: InlineElement = rightTraverser.currentInlineElement;
            let offset: number | null = null;
            let endOffset: number = 0;
            let word: string = '';

            while (inLine && offset === null) {
                word = inLine.getTextContent();
                offset = findDelimiterRight(word);

                console.log(word);
                if (offset === null) {
                    endOffset = word.length - 1;
                    inLine = rightTraverser.getNextInlineElement();
                } else {
                    endOffset = offset;
                }
            }

            inLine = leftTraverser.currentInlineElement;
            offset = null;
            startOffset = 0;
            //Skip first
            leftTraverser.getPreviousInlineElement();

            while (inLine && offset === null) {
                word = inLine.getTextContent();
                offset = findDelimiterLeft(word);

                if (offset === null) {
                    startOffset = 0;
                    inLine = leftTraverser.getPreviousInlineElement();
                } else {
                    startOffset = offset;
                }
            }

            console.log(startOffset, endOffset);
            if (true) {
                range.setStart(leftTraverser.currentInlineElement.getContainerNode(), startOffset);
                range.setEnd(rightTraverser.currentInlineElement.getContainerNode(), endOffset);
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

function findDelimiterRight(word: string): number | null {
    let offset: number | null = null;
    for (let index = 0; index < word.length; index++) {
        if (isWordDelimiter(word[index])) {
            offset = index;
            break;
        }
    }
    return offset;
}

function findDelimiterLeft(word: string): number | null {
    let offset: number | null = null;
    for (let index = word.length - 1; index >= 0; index--) {
        if (isWordDelimiter(word[index])) {
            offset = index + 1;
            break;
        }
    }
    if (offset < 0) {
        offset = 0;
    }
    return offset;
}
