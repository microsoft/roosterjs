import { isBlockElement, Position, splitTextNode } from 'roosterjs-editor-dom';
import { IEditor /*InlineElement */ } from 'roosterjs-editor-types/lib';

const PUNCTUATION_REGEX = /[.,:!?()\[\]\\/]/gu;
const SPACES_REGEX = /[\u00A0\u1680​\u180e\u2000\u2009\u200a​\u200b​\u202f\u205f​\u3000\s\t\r\n]/gm;

//If selection is collapsed, select the whole word.
export default function selectWordFromCollapsedRange(range: Range, editor: IEditor) {
    if (range?.collapsed) {
        const pos = Position.getStart(range);
        const text = pos.node.textContent;
        //console.log()
        //debugger

        if (text && !isBlockElement(pos.node)) {
            let startOffset: number = range.startOffset;
            let endOffset: number = range.startOffset;

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

            let lNode: Node = pos.node;
            let rNode: Node = splitTextNode(pos.node as Text, range.startOffset, false);

            let offset: number | null = null;
            let word: string = '';

            while (lNode && offset === null) {
                word = lNode.textContent;
                offset = findDelimiterLeft(word);

                if (offset === null) {
                    startOffset = 0;
                    lNode.previousSibling ? (lNode = lNode.previousSibling) : (offset = undefined);
                } else {
                    startOffset = offset;
                }
            }

            offset = null;

            while (rNode && offset === null) {
                word = rNode.textContent;
                offset = findDelimiterRight(word);

                if (offset === null) {
                    endOffset = word.length;
                    rNode.nextSibling ? (rNode = rNode.nextSibling) : (offset = undefined);
                } else {
                    endOffset = offset;
                }
            }

            /*
            while (true) {
                let x = lNode.nextSibling;
                console.log('#', x.textContent, '#', x.textContent == '');
                lNode = lNode.nextSibling;
                debugger;
            }*/

            //const leftTraverser = editor.getBlockTraverser();
            //const rightTraverser = editor.getBlockTraverser();

            //let lNode: Node = pos.node;
            //let rNode: Node = pos.node;

            /*
            let offset: number | null = null;
            let word: string = '';

            //Skip first
            leftTraverser.getPreviousInlineElement();
            let inLine: InlineElement = leftTraverser.currentInlineElement;
            startOffset = 0;

            let leftOffset = 0;
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
            leftOffset = word.length;

            if (leftTraverser.currentInlineElement) {
                lNode = leftTraverser.currentInlineElement.getContainerNode();
            }

            inLine = rightTraverser.currentInlineElement;
            offset = null;

            while (inLine && offset === null) {
                word = inLine.getTextContent();
                offset = findDelimiterRight(word);

                if (offset === null) {
                    endOffset = word.length;
                    inLine = rightTraverser.getNextInlineElement();
                } else {
                    endOffset = offset;
                }
            }

            if (rightTraverser.currentInlineElement) {
                rNode = rightTraverser.currentInlineElement.getContainerNode();
            }

            */
            console.log(startOffset, endOffset, 'L:', lNode, 'R:', rNode);
            //debugger;

            //const rSize = rNode.textContent.length;

            range.setStart(lNode, startOffset);
            range.setEnd(rNode, endOffset);

            /*
            if (lNode === rNode) {
                endOffset += inLine ? leftOffset : 0;
                range.setStart(lNode, startOffset);
                range.setEnd(rNode, endOffset);
            } else {
                range.setStart(lNode, startOffset);
                range.setEnd(rNode, endOffset);
            }
            */
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
