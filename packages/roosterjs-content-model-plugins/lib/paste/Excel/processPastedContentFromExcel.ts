import { addParser } from '../utils/addParser';
import { isNodeOfType, moveChildNodes, retrieveCssRules } from 'roosterjs-content-model-dom';
import { setProcessor } from '../utils/setProcessor';
import type { BeforePasteEvent, DOMCreator, ElementProcessor } from 'roosterjs-content-model-types';

const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;
const TABLE_SELECTOR = 'table';
const DEFAULT_BORDER_STYLE = 'solid 1px #d4d4d4';
const HTML_COMMENT_START = '\x3C!--';
const HTML_COMMENT_END = '-->';

/**
 * @internal
 * Convert pasted content from Excel, add borders when source doc doesn't have a border
 * @param event The BeforePaste event
 * @param domCreator The DOM creator
 * @param allowExcelNoBorderTable Allow table copied from Excel without border
 * @param isNativeEvent Whether the event is native event
 */
export function processPastedContentFromExcel(
    event: BeforePasteEvent,
    domCreator: DOMCreator,
    allowExcelNoBorderTable: boolean,
    isNativeEvent: boolean
) {
    // For non native event we already validated that the content contains a table
    if (isNativeEvent) {
        validateExcelFragment(event, domCreator);
    }

    // For Excel Online
    const firstChild = event.fragment.firstChild;
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

    setupExcelTableHandlers(
        event,
        allowExcelNoBorderTable,
        isNativeEvent /* handleForNativeEvent */
    );
}

/**
 * @internal
 * Exported only for unit test
 */
export function validateExcelFragment(event: BeforePasteEvent, domCreator: DOMCreator) {
    const { clipboardData, fragment, htmlBefore, htmlAfter } = event;
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
    const htmlBeforeRemovingComments = htmlBefore
        .replace(HTML_COMMENT_START, '')
        .replace(HTML_COMMENT_END, '');
    const result = domCreator.htmlToDOM(
        htmlBeforeRemovingComments + clipboardData.html + htmlAfter
    );
    if (result && result.querySelector(TABLE_SELECTOR)) {
        const newRules = retrieveCssRules(result);
        if (event.cssRulesToBeConverted) {
            event.cssRulesToBeConverted.push(...newRules);
        } else {
            event.cssRulesToBeConverted = newRules;
        }
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

/**
 * @internal
 * Exported only for unit test
 */
export function setupExcelTableHandlers(
    event: BeforePasteEvent,
    allowExcelNoBorderTable: boolean | undefined,
    isNativeEvent: boolean
) {
    addParser(event.domToModelOption, 'tableCell', (format, element) => {
        if (
            !allowExcelNoBorderTable &&
            (element.style.borderStyle === 'none' ||
                (!isNativeEvent && element.style.borderStyle == ''))
        ) {
            format.borderBottom = DEFAULT_BORDER_STYLE;
            format.borderLeft = DEFAULT_BORDER_STYLE;
            format.borderRight = DEFAULT_BORDER_STYLE;
            format.borderTop = DEFAULT_BORDER_STYLE;
        }
    });

    setProcessor(event.domToModelOption, 'child', childProcessor);
}

/**
 * @internal
 * Exported only for unit test
 */
export const childProcessor: ElementProcessor<ParentNode> = (group, element, context) => {
    const segmentFormat = { ...context.segmentFormat };
    if (
        group.blockGroupType === 'TableCell' &&
        group.format.textColor &&
        !context.segmentFormat.textColor
    ) {
        context.segmentFormat.textColor = group.format.textColor;
    }

    context.defaultElementProcessors.child(group, element, context);

    if (group.blockGroupType === 'TableCell' && group.format.textColor) {
        context.segmentFormat = segmentFormat;
        delete group.format.textColor;
    }
};
