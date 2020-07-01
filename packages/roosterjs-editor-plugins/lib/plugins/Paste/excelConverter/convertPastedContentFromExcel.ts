import { BeforePasteEvent } from 'roosterjs-editor-types';
import { chainSanitizerCallback } from 'roosterjs-editor-dom';

const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;

/**
 * Convert pasted content from Excel, add borders when source doc doesn't have a border
 * @param doc HTML Document which contains the content from Excel
 */
export default function convertPastedContentFromExcel(event: BeforePasteEvent) {
    const {
        fragment,
        sanitizingOption,
        htmlBefore,
        clipboardData: { html },
    } = event;
    let newHtml = event.clipboardData.html;

    if (html.match(LAST_TD_END_REGEX)) {
        const trMatch = htmlBefore.match(LAST_TR_REGEX);
        const tr = trMatch ? trMatch[0] : '<TR>';
        newHtml = tr + html + '</TR>';
    }
    if (html.match(LAST_TR_END_REGEX)) {
        let tableMatch = htmlBefore.match(LAST_TABLE_REGEX);
        let table = tableMatch ? tableMatch[0] : '<TABLE>';
        newHtml = table + html + '</TABLE>';
    }

    if (newHtml != html) {
        const doc = new DOMParser().parseFromString(newHtml, 'text/html');
        while (fragment.firstChild) {
            fragment.removeChild(fragment.firstChild);
        }
        while (doc?.body?.firstChild) {
            fragment.appendChild(doc.body.firstChild);
        }
    }

    chainSanitizerCallback(sanitizingOption.elementCallbacks, 'TD', element => {
        if (element.style.border == 'none') {
            element.style.border = 'solid 1px #d4d4d4';
        }
        return true;
    });
}
