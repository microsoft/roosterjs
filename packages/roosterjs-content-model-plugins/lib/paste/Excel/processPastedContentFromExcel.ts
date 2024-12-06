import { addParser } from '../utils/addParser';
import { isNodeOfType, moveChildNodes } from 'roosterjs-content-model-dom';
import { setProcessor } from '../utils/setProcessor';
import type { BeforePasteEvent, DOMCreator, ElementProcessor } from 'roosterjs-content-model-types';

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
    event: BeforePasteEvent,
    domCreator: DOMCreator,
    allowExcelNoBorderTable?: boolean
) {
    const { fragment, htmlBefore, clipboardData } = event;
    const html = clipboardData.html ? excelHandler(clipboardData.html, htmlBefore) : undefined;

    if (html && clipboardData.html != html) {
        const doc = domCreator.htmlToDOM(html);
        moveChildNodes(fragment, doc?.body);
    }

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

    addParser(event.domToModelOption, 'tableCell', (format, element) => {
        if (!allowExcelNoBorderTable && element.style.borderStyle === 'none') {
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
        const tableMatch = htmlBefore.match(LAST_TABLE_REGEX);
        const table = tableMatch ? tableMatch[0] : '<TABLE>';
        html = table + html + '</TABLE>';
    }

    return html;
}
