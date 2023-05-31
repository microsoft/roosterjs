import convertPastedContentFromOfficeOnline from '../../../lib/plugins/Paste/officeOnlineConverter/convertPastedContentFromOfficeOnline';
import { createDefaultHtmlSanitizerOptions, toArray } from 'roosterjs-editor-dom';

describe('convertPastedContentFromOfficeOnlineTest', () => {
    function runTest(html: string, expectedInnerHtml: string) {
        const doc = sanitizeContent(html);

        expect(doc.body.innerHTML).toBe(expectedInnerHtml);
    }

    it('remove table temp elements', () => {
        runTest(
            '<table aria-rowcount="1" data-tablelook="1184" data-tablestyle="MsoTableGrid" border="1" class="Table TableStaticStyles Ltr TableWordWrap SCXW96211671 BCX8" id="table"><tbody><tr aria-rowindex="1" role="row"><td data-celllook="69905" role="rowheader"><div></div><div class="TableHoverColumnHandle"></div><div></div><div class="TableCellTopBorderHandle"></div><div class="TableColumnResizeHandle"></div><div class="TableInsertRowGapBlank"></div><div><div><p><span lang="EN-US" data-contrast="auto">a</span></p></div></div></td><td data-celllook="69905" role="columnheader"><div class="TableHoverColumnHandle"></div><div class="TableCellTopBorderHandle"></div><div class="TableColumnResizeHandle"></div><div class="TableInsertRowGapBlank"></div><div><p><span>asd</span></p></div></td></tr></tbody></table>',
            '<table><tbody><tr><td><div></div><div></div><div><div><p><span>a</span></p></div></div></td><td><div><p><span>asd</span></p></div></td></tr></tbody></table>'
        );
    });
});

function sanitizeContent(html: string) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fragment = doc.createDocumentFragment();
    while (doc.body.firstChild) {
        fragment.appendChild(doc.body.firstChild);
    }
    const opts = createDefaultHtmlSanitizerOptions();
    convertPastedContentFromOfficeOnline(fragment, opts);

    fragment.querySelectorAll('*').forEach(n => {
        toArray(n.attributes).forEach(a => n.removeAttribute(a.name));
    });
    while (fragment.firstChild) {
        doc.body.appendChild(fragment.firstChild);
    }
    return doc;
}
