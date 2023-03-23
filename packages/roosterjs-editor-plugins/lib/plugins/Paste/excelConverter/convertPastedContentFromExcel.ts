import { BeforePasteEvent, TrustedHTMLHandler } from 'roosterjs-editor-types';
import { chainSanitizerCallback, getTagOfNode, moveChildNodes } from 'roosterjs-editor-dom';

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
export default function convertPastedContentFromExcel(
    event: BeforePasteEvent,
    trustedHTMLHandler: TrustedHTMLHandler
) {
    const { fragment, sanitizingOption, htmlBefore, clipboardData } = event;
    const html = excelHandler(clipboardData.html, htmlBefore);

    // For Excel Online
    if (fragment.childNodes.length > 0 && getTagOfNode(fragment.firstChild) == 'DIV') {
        fragment.firstChild.childNodes.forEach(child => {
            if (getTagOfNode(child) == 'TABLE') {
                event.fragment.replaceChildren(child);
            }
        });
    }

    if (clipboardData.html != html) {
        const doc = new DOMParser().parseFromString(trustedHTMLHandler(html), 'text/html');
        moveChildNodes(fragment, doc?.body);
    }

    chainSanitizerCallback(sanitizingOption.elementCallbacks, 'TD', element => {
        if (element.style.borderStyle == 'none') {
            element.style.border = DEFAULT_BORDER_STYLE;
        }
        return true;
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
