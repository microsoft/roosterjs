import { excelHandler } from '../../lib/plugins/Paste/excelConverter/convertPastedContentFromExcel';

describe('convertPastedContentFromExcel', () => {
    function runTest(html: string, htmlBefore: string, expectedInnerHtml: string) {
        const result = excelHandler(html, htmlBefore);
        expect(result.toLowerCase()).toBe(expectedInnerHtml);
    }

    it('Table', () => {
        runTest(
            '<table><tr><td>a</td><td></td></tr></table>',
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body>',
            '<table><tr><td>a</td><td></td></tr></table>'
        );
    });

    it('Table without TR', () => {
        runTest(
            '<td>a</td><td></td>',
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table><tr>',
            '<table><tr><td>a</td><td></td></tr></table>'
        );
    });

    it('Table without TABLE', () => {
        runTest(
            '<tr><td>a</td><td></td></tr>',
            '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><body><table>',
            '<table><tr><td>a</td><td></td></tr></table>'
        );
    });
});
