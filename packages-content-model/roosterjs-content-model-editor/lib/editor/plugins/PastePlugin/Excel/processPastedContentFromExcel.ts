import addParser from '../utils/addParser';
import ContentModelBeforePasteEvent from '../../../../publicTypes/event/ContentModelBeforePasteEvent';
import { getTagOfNode, moveChildNodes } from 'roosterjs-editor-dom';
import { TrustedHTMLHandler } from 'roosterjs-editor-types';

const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;
const DEFAULT_BORDER_STYLE = 'solid 1px #d4d4d4';

/**
 * @internal
 * Convert pasted content from Excel, add borders when source doc doesn't have a border
 * @param event The BeforePaste event
 */

export function processPastedContentFromExcel(
    event: ContentModelBeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { fragment, htmlBefore, clipboardData } = event;
    const html = clipboardData.html ? excelHandler(clipboardData.html, htmlBefore) : undefined;

    if (html && clipboardData.html != html) {
        const doc = new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html');
        moveChildNodes(fragment, doc?.body);
    }

    // For Excel Online
    const firstChild = fragment.firstChild;
    if (firstChild && firstChild.childNodes.length > 0 && getTagOfNode(firstChild) == 'DIV') {
        const tableFound = Array.from(firstChild.childNodes).every((child: Node) => {
            // Tables pasted from Excel Online should be of the format: 0 to N META tags and 1 TABLE tag
            return getTagOfNode(child) == 'META'
                ? true
                : getTagOfNode(child) == 'TABLE' && child == firstChild.lastChild;
        });

        // Extract Table from Div
        if (tableFound && firstChild.lastChild) {
            event.fragment.replaceChildren(firstChild.lastChild);
        }
    }

    addParser(event.domToModelOption, 'tableCell', (format, element) => {
        if (element.style.borderStyle === 'none') {
            format.borderBottom = DEFAULT_BORDER_STYLE;
            format.borderLeft = DEFAULT_BORDER_STYLE;
            format.borderRight = DEFAULT_BORDER_STYLE;
            format.borderTop = DEFAULT_BORDER_STYLE;
        }
    });
}

/**
 * @internal Export for test only
 * @param html Source html
 */

export function excelHandler(html: string, htmlBefore: string): string {
    if (html.match(LAST_TD_END_REGEX)) {
        const trMatch = htmlBefore.match(LAST_TR_REGEX);
        const tr = trMatch ? trMatch[0] : '<TR>';
        html = tr + html + '</TR>';
    }
    if (html.match(LAST_TR_END_REGEX)) {
        let tableMatch = htmlBefore.match(LAST_TABLE_REGEX);
        let table = tableMatch ? tableMatch[0] : '<TABLE>';
        html = table + html + '</TABLE>';
    }

    return html;
}
