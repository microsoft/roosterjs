import HtmlSanitizer from '../sanitizer/HtmlSanitizer';

describe('globalCssToInline', () => {
    it('input = "" ', () => {
        runTest('', '');
    });

    it('input = <div style="margin-top:0;">Test</div>', () => {
        runTest('<div style="margin-top:0;">Test</div>', '<div style="margin-top:0;">Test</div>');
    });

    it('input = <style>div{font-size:12px}</style><div style="margin-top:0;">Test</div>', () => {
        runTest(
            '<style>div{font-size: 12px}</style><div style="margin-top: 0;">Test</div>',
            '<div style="font-size: 12px;margin-top: 0;">Test</div>'
        );
    });

    it('input = <style>div{font-size:12px}</style><style>div{background-color:#98a3a6}<div style="margin-top:0;">Test</div>', () => {
        runTest(
            '<style>div{font-size: 12px}</style><style>div{background-color:#98a3a6}</style><div style="margin-top: 0;">Test</div>',
            '<div style="font-size: 12px;background-color: rgb(152, 163, 166);margin-top: 0;">Test</div>'
        );
    });

    // @page, should just skip
    it('input = <style>@page WordSection1{size:8.5in 11.0in; margin:1.0in 1.0in 1.0in 1.0in;}</style><div>Test</div>', () => {
        runTest(
            '<style>@page WordSection1{size:8.5in 11.0in; margin:1.0in 1.0in 1.0in 1.0in;}</style><div>Test</div>',
            '<div>Test</div>'
        );
    });

    // :hover, should just skip
    it('input = <style>a:hover {color: red}</style><div><a src="www.bing.com">BING</div>', () => {
        runTest(
            '<style>a:hover {color: red}</style><div><a src="www.bing.com">BING</div>',
            '<div><a src="www.bing.com">BING</a></div>'
        );
    });

    function runTest(input: string, output: string) {
        // Act
        let result = HtmlSanitizer.convertInlineCss(input);

        // Assert
        expect(result).toBe(output);
        expect(output.indexOf('<style>')).toBe(-1);
    }
});
