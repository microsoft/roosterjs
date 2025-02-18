import { isNodeOfType, moveChildNodes } from 'roosterjs-content-model-dom';
import { setupExcelTableHandlers } from './setupExcelTableHandlers';
import type { BeforePasteEvent, ClipboardData, DOMCreator } from 'roosterjs-content-model-types';

const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;
const TABLE_SELECTOR = 'table';

/**
 * @internal
 * Convert pasted content from Excel, add borders when source doc doesn't have a border
 * @param event The BeforePaste event
 */

export function processPastedContentFromExcel(
    event: BeforePasteEvent,
    domCreator: DOMCreator,
    allowExcelNoBorderTable?: boolean
) {
    const { fragment, htmlBefore, htmlAfter, clipboardData } = event;

    validateExcelFragment(fragment, domCreator, htmlBefore, clipboardData, htmlAfter);

    // For Excel Online
    const firstChild = fragment.firstChild;
    if (
        isNodeOfType(firstChild, 'ELEMENT_NODE') &&
        firstChild.tagName == 'div' &&
        firstChild.firstChild
    ) {
        const tableFound = Array.from(firstChild.childNodes).every((child: Node) => {
            // Tables pasted from Excel Online should be of the format: 0 to N META tags and 1 TABLE tag
            const tagName = isNodeOfType(child, 'ELEMENT_NODE') && child.tagName;

            return tagName == 'META'
                ? true
                : tagName == 'TABLE'
                ? child == firstChild.lastChild
                : false;
        });

        // Extract Table from Div
        if (tableFound && firstChild.lastChild) {
            event.fragment.replaceChildren(firstChild.lastChild);
        }
    }

    setupExcelTableHandlers(event, allowExcelNoBorderTable, true /* handleForNativeEvent */);
}

/**
 * @internal
 * Exported only for unit test
 */
export function validateExcelFragment(
    fragment: DocumentFragment,
    domCreator: DOMCreator,
    htmlBefore: string,
    clipboardData: ClipboardData,
    htmlAfter: string
) {
    // Clipboard content of Excel may contain the <StartFragment> and EndFragment comment tags inside the table
    //
    // @example
    // <table>
    // <!--StartFragment-->
    // <tr>...</tr>
    // <!--EndFragment-->
    // </table>
    //
    // This causes that the fragment is not properly created and the table is not extracted.
    // The content that is before the StartFragment is htmlBefore and the content that is after the EndFragment is htmlAfter.
    // So attempt to create a new document fragment with the content of htmlBefore + clipboardData.html + htmlAfter
    // If a table is found, replace the fragment with the new fragment
    const result =
        !fragment.querySelector(TABLE_SELECTOR) &&
        domCreator.htmlToDOM(htmlBefore + clipboardData.html + htmlAfter);
    if (result && result.querySelector(TABLE_SELECTOR)) {
        moveChildNodes(fragment, result?.body);
    } else {
        // If the table is still not found, try to extract the table from the clipboard data using Regex
        const html = clipboardData.html ? excelHandler(clipboardData.html, htmlBefore) : undefined;

        if (html && clipboardData.html != html) {
            const doc = domCreator.htmlToDOM(html);
            moveChildNodes(fragment, doc?.body);
        }
    }
}

/**
 * @internal Export for test only
 * @param html Source html
 */
export function excelHandler(html: string, htmlBefore: string): string {
    try {
        if (html.match(LAST_TD_END_REGEX)) {
            const trMatch = htmlBefore.match(LAST_TR_REGEX);
            const tr = trMatch ? trMatch[0] : '<TR>';
            html = tr + html + '</TR>';
        }
        if (html.match(LAST_TR_END_REGEX)) {
            const tableMatch = htmlBefore.match(LAST_TABLE_REGEX);
            const table = tableMatch ? tableMatch[0] : '<TABLE>';
            html = table + html + '</TABLE>';
        }
    } finally {
        return html;
    }
}
