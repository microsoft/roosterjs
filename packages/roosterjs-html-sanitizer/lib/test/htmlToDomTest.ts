import htmlToDom from '../utils/htmlToDom';

describe('htmlToDom', () => {
    function runTest(html: string, preserveFragmentOnly: boolean, expectedInnerHtml: string) {
        let doc = htmlToDom(html, preserveFragmentOnly);
        if (expectedInnerHtml === null) {
            expect(doc).toBeNull();
        } else {
            expect(doc.body.innerHTML).toBe(expectedInnerHtml);
        }
    }
    it('NULL', () => {
        runTest(null, false, null);
        runTest('', false, null);
    });

    it('Plain text', () => {
        runTest('This is a test', false, 'This is a test');
    });

    it('Regular HTML', () => {
        runTest('<b>This is a test</b>', false, '<b>This is a test</b>');
    });

    it('Invalid HTML', () => {
        runTest('<b>This <i>is </b> a </i> test', false, '<b>This <i>is </i></b><i> a </i> test');
    });

    it('HTML with fragment', () => {
        runTest(
            '<html><body><table><tr><td><!--StartFragment--><b>This is a test</b><!--EndFragment--></td></tr></table></body></html>',
            true,
            '<b>This is a test</b>'
        );
    });
});
