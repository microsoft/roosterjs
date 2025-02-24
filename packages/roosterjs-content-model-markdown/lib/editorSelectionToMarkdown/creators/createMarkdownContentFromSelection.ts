import { createMarkdownImageFromSelection } from './createMarkdownImageFromSelection';
import { createMarkdownTableFromSelection } from './createMarkdownTableFromSelection';
import { isElementOfType, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import type { RangeSelection } from 'roosterjs-content-model-types';

const HEADINGS: Record<string, string> = {
    H1: '#',
    H2: '##',
    H3: '###',
    H4: '####',
    H5: '#####',
    H6: '######',
};

/**
 * @internal
 */
export function createMarkdownContentFromSelection(selection: RangeSelection): string {
    let content = '';
    const rangeContent = selection.range.cloneContents();
    const nodes = toArray(rangeContent.childNodes);

    for (const node of nodes) {
        if (isNodeOfType(node, 'ELEMENT_NODE')) {
            const element = removeBoldAndItalicTags(node);
            switch (element.nodeName) {
                case 'UL':
                case 'OL':
                    const list = element as HTMLUListElement | HTMLOListElement;
                    content += convertListToMarkdown(list) + '\n';
                    break;
                case 'BLOCKQUOTE':
                    const blockquote = element as HTMLQuoteElement;
                    content += convertMarkdownBlockquote(blockquote) + '\n';
                    break;
                case 'HR':
                    content += '\n---\n\n';
                    break;
                case 'TABLE':
                    const table = element as HTMLTableElement;
                    content +=
                        createMarkdownTableFromSelection({
                            type: 'table',
                            table,
                            firstRow: 0,
                            lastRow: table.rows.length - 1,
                            firstColumn: 0,
                            lastColumn: table.rows[0].cells.length - 1,
                        }) + '\n';
                    break;
                case 'B':
                case 'I':
                    content += convertItalicAndBoldToMarkdown(element);
                    break;
                case 'H1':
                case 'H2':
                case 'H3':
                case 'H4':
                case 'H5':
                case 'H6':
                    content += convertMarkdownHeader(element) + '\n\n';
                    break;
                case 'DIV':
                case 'P':
                    content += createMarkdownFromBlockParagraph(element) + '\n\n';
                    break;
                default:
                    content += createMarkdownSegments(element);
            }
        } else {
            content += node.textContent;
        }
    }
    return content;
}

function convertMarkdownHeader(textElement: HTMLElement): string {
    const heading = textElement.nodeName;
    const content = createMarkdownFromBlockParagraph(textElement);
    return (HEADINGS[heading] || '') + ' ' + content;
}

function convertMarkdownBlockquote(textElement: HTMLElement): string {
    const quotes = toArray(textElement.childNodes);
    const content = quotes.map(quote => '> ' + createMarkdownSegments(quote)).join('\n');
    return content;
}

function createMarkdownSegments(child: ChildNode): string {
    switch (child.nodeName) {
        case 'IMG':
            const image = child as HTMLImageElement;
            return createMarkdownImageFromSelection(image);
        case 'A':
            const anchor = child as HTMLAnchorElement;
            return `[${anchor.textContent}](${anchor.href})`;
        default:
            return child.textContent || '';
    }
}

function createMarkdownFromBlockParagraph(textElement: HTMLElement): string {
    let content = '';
    const childNodes = Array.from(textElement.childNodes);
    for (const child of childNodes) {
        if (child.nodeName === 'SPAN') {
            const spanChild = toArray(child.childNodes);
            content += spanChild.map(spanChild => createMarkdownSegments(spanChild)).join('');
        } else {
            content += createMarkdownSegments(child);
        }
    }
    return content;
}

function removeBoldAndItalicTags(element: HTMLElement): HTMLElement {
    const bold = toArray(element.querySelectorAll('b'));
    for (const b of bold) {
        const text = document.createTextNode(`**${b.textContent}**`);
        b.parentElement?.replaceChild(text, b);
    }

    const italic = toArray(element.querySelectorAll('i'));
    for (const i of italic) {
        const text = document.createTextNode(`*${i.textContent}*`);
        i.parentElement?.replaceChild(text, i);
    }
    return element;
}

function convertListToMarkdown(list: HTMLUListElement | HTMLOListElement): string {
    let content = '';
    const children = toArray(list.childNodes);
    let position = 1;
    for (const child of children) {
        if (isNodeOfType(child, 'ELEMENT_NODE') && isElementOfType(child, 'li')) {
            content += `${getListMarker(list, position)} ${createMarkdownFromBlockParagraph(
                child
            )}\n`;
            position++;
        }
    }
    return content;
}

function getListMarker(list: HTMLUListElement | HTMLOListElement, position: number): string {
    return list.nodeName === 'UL' ? '-' : `${position}.`;
}

function convertItalicAndBoldToMarkdown(element: HTMLElement): string {
    return element.nodeName === 'B' ? `**${element.textContent}**` : `*${element.textContent}*`;
}
