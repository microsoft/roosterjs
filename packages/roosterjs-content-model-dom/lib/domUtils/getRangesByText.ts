import { isBlockElement } from '../domToModel/utils/isBlockElement';
import { isNodeOfType } from './isNodeOfType';
import { isPunctuation, isSpace } from './stringUtil';

const SplittingTags: string[] = ['BR', 'HR', 'IMG'];

interface SearchContext {
    text: string;
    matchCase: boolean;
    wholeWord: boolean;
    result: Range[];
    paragraphText: string;
    editableOnly: boolean;
    indexes: {
        node: Text;
        length: number;
    }[];
}

/**
 * Search text from the given root element and return all ranges that match the search criteria
 * @param root Root element to search from
 * @param text Text to search for
 * @param matchCase Whether to match case
 * @param wholeWord Whether to match whole words only
 * @param editableOnly Whether to search only in editable elements
 * @returns Array of matching ranges
 */
export function getRangesByText(
    root: HTMLElement,
    text: string,
    matchCase: boolean,
    wholeWord: boolean,
    editableOnly?: boolean
): Range[] {
    const context: SearchContext = {
        text: matchCase ? text : text.toLowerCase(),
        matchCase,
        wholeWord,
        result: [],
        paragraphText: '',
        indexes: [],
        editableOnly: !!editableOnly,
    };

    if (context.text) {
        iterateTextNodes(root, context);
    }

    return context.result;
}

function isSplittingElement(element: HTMLElement) {
    return isBlockElement(element) || SplittingTags.indexOf(element.tagName) >= 0;
}

function iterateTextNodes(root: HTMLElement, context: SearchContext) {
    const canSearchText = !context.editableOnly || root.isContentEditable;

    for (let node = root.firstChild; node; node = node.nextSibling) {
        if (isNodeOfType(node, 'TEXT_NODE') && canSearchText) {
            const nodeText = context.matchCase
                ? node.nodeValue || ''
                : (node.nodeValue || '').toLowerCase();

            if (nodeText) {
                context.paragraphText += nodeText;
                context.indexes.push({ node, length: nodeText.length });
            }
        } else if (isNodeOfType(node, 'ELEMENT_NODE')) {
            if (context.paragraphText && isSplittingElement(node)) {
                search(root.ownerDocument, context);
            }

            iterateTextNodes(node, context);
        }
    }

    if (context.paragraphText && isSplittingElement(root)) {
        search(root.ownerDocument, context);
    }
}

function search(doc: Document, context: SearchContext) {
    let offset: number;
    let startIndex = 0;

    while ((offset = context.paragraphText.indexOf(context.text, startIndex)) > -1) {
        if (
            !context.wholeWord ||
            ((offset == 0 || isSpaceOrPunctuation(context.paragraphText[offset - 1])) &&
                (offset + context.text.length == context.paragraphText.length ||
                    isSpaceOrPunctuation(context.paragraphText[offset + context.text.length])))
        ) {
            const start = findNodeAndOffset(context.indexes, offset, false /*isEnd*/);
            const end = findNodeAndOffset(
                context.indexes,
                offset + context.text.length,
                true /*isEnd*/
            );

            if (start && end) {
                const range = doc.createRange();

                range.setStart(start.node, start.offset);
                range.setEnd(end.node, end.offset);
                context.result.push(range);
            }
        }

        startIndex = offset + context.text.length;
    }

    context.paragraphText = '';
    context.indexes = [];
}

function isSpaceOrPunctuation(char: string) {
    return isSpace(char) || isPunctuation(char);
}

function findNodeAndOffset(
    lengths: { length: number; node: Text }[],
    offset: number,
    isEnd: boolean
): { node: Text; offset: number } | null {
    let currentIndex = 0;

    for (let i = 0; i < lengths.length; i++) {
        const segmentLength = lengths[i].length;

        if (
            isEnd ? currentIndex + segmentLength >= offset : currentIndex + segmentLength > offset
        ) {
            return { node: lengths[i].node, offset: offset - currentIndex };
        }

        currentIndex += segmentLength;
    }

    return null;
}
