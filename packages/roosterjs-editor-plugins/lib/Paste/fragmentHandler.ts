import convertPastedContentFromExcel from './excelConverter/convertPastedContentFromExcel';
import convertPastedContentFromWord from './wordConverter/convertPastedContentFromWord';
import convertPastedContentFromWordOnline, {
    isWordOnlineWithList,
} from './officeOnlineConverter/convertPastedContentFromWordOnline';
import { WAC_IDENTIFING_SELECTOR } from './officeOnlineConverter/constants';
import { getTagOfNode } from 'roosterjs-editor-dom';
import { splitWithFragment } from 'roosterjs-html-sanitizer';

const WORD_ATTRIBUTE_NAME = 'xmlns:w';
const WORD_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:word';
const EXCEL_ATTRIBUTE_NAME = 'xmlns:x';
const EXCEL_ATTRIBUTE_VALUE = 'urn:schemas-microsoft-com:office:excel';

const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;

export default function fragmentHandler(doc: HTMLDocument, source: string) {
    let [html, before] = splitWithFragment(source);
    let firstNode = doc && doc.body && (doc.querySelector('html') as HTMLElement);
    if (getTagOfNode(firstNode) == 'HTML') {
        let wacListElements: NodeListOf<Element>;
        if (firstNode.getAttribute(WORD_ATTRIBUTE_NAME) == WORD_ATTRIBUTE_VALUE) {
            // Handle HTML copied from MS Word
            doc.body.innerHTML = html;
            convertPastedContentFromWord(doc);
        } else if ((wacListElements = firstNode.querySelectorAll(WAC_IDENTIFING_SELECTOR))[0]) {
            // Once it is known that the document is from WAC
            // We need to remove the display property and margin from all the list item
            wacListElements.forEach((el: HTMLElement) => {
                el.style.display = null;
                el.style.margin = null;
            });
            // call conversion function if the pasted content is from word online and
            // has list element in the pasted content.
            if (isWordOnlineWithList(firstNode)) {
                convertPastedContentFromWordOnline(doc);
            }
        } else if (firstNode.getAttribute(EXCEL_ATTRIBUTE_NAME) == EXCEL_ATTRIBUTE_VALUE) {
            // Handle HTML copied from MS Excel
            if (html.match(LAST_TD_END_REGEX)) {
                let trMatch = before.match(LAST_TR_REGEX);
                let tr = trMatch ? trMatch[0] : '<TR>';
                html = tr + html + '</TR>';
            }
            if (html.match(LAST_TR_END_REGEX)) {
                let tableMatch = before.match(LAST_TABLE_REGEX);
                let table = tableMatch ? tableMatch[0] : '<TABLE>';
                html = table + html + '</TABLE>';
            }
            doc.body.innerHTML = html;
            convertPastedContentFromExcel(doc);
        } else {
            // Handle HTML copied from other places
            doc.body.innerHTML = html;
        }
    }
}
