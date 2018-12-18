import { htmlToDom } from 'roosterjs-html-sanitizer';
import fragmentHandler from '../Paste/fragmentHandler';

describe('fragmentHandler', () => {
    function runTest(html: string, preserveFragmentOnly: boolean, expectedInnerHtml: string) {
        let doc = htmlToDom(html, preserveFragmentOnly, fragmentHandler);
        if (expectedInnerHtml === null) {
            expect(doc).toBeNull();
        } else {
            expect(doc.body.innerHTML).toBe(expectedInnerHtml);
        }
    }

    it('HTML with fragment from EXCEL', () => {
        runTest(
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table><tr><!--StartFragment--><td>a</td><td></td><!--EndFragment--></tr></table></body></html>',
            true,
            '<table><tbody><tr><td style="border: 1px solid rgb(212, 212, 212);">a</td><td style="border: 1px solid rgb(212, 212, 212);"></td></tr></tbody></table>'
        );
        runTest(
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table><!--StartFragment--><tr><td>a</td><td></td></tr><!--EndFragment--></table></body></html>',
            true,
            '<table><tbody><tr><td style="border: 1px solid rgb(212, 212, 212);">a</td><td style="border: 1px solid rgb(212, 212, 212);"></td></tr></tbody></table>'
        );
    });
});
