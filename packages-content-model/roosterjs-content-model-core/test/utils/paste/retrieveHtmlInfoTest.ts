import { ClipboardData } from 'roosterjs-content-model-types';
import { HtmlFromClipboard, retrieveHtmlInfo } from '../../../lib/utils/paste/retrieveHtmlInfo';
import { itChromeOnly } from 'roosterjs-editor-dom/test/DomTestHelper';

describe('retrieveHtmlInfo', () => {
    function runTest(
        rawHtml: string | null,
        expectedResult: HtmlFromClipboard,
        expectedClipboard: Partial<ClipboardData>,
        expectedHtml: string | undefined
    ) {
        const doc = rawHtml === null ? null : new DOMParser().parseFromString(rawHtml, 'text/html');
        const clipboardData: Partial<ClipboardData> = {
            rawHtml,
        };

        const result = retrieveHtmlInfo(doc, clipboardData);

        expect(result).toEqual(expectedResult);
        expect(clipboardData).toEqual({
            rawHtml,
            ...expectedClipboard,
        });
        expect(doc?.body.innerHTML).toEqual(expectedHtml);
    }

    it('Null doc', () => {
        runTest(
            null,
            {
                metadata: {},
                globalCssRules: [],
            },
            {},
            undefined
        );
    });

    it('Empty doc', () => {
        runTest(
            '',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: [],
                html: '',
            },
            ''
        );
    });

    it('Text node only', () => {
        runTest(
            'test',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: [''],
                html: 'test',
            },
            'test'
        );
    });

    it('DIV and text node only', () => {
        runTest(
            '<div>test</div>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html: '<div>test</div>',
            },
            '<div>test</div>'
        );
    });

    it('text, DIV, SPAN and comment node only', () => {
        runTest(
            'test1<div>test2</div> <!--test3-->\r\n<span>test4</span>test5',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['', 'DIV', 'SPAN', ''],
                html: 'test1<div>test2</div> <!--test3-->\r\n<span>test4</span>test5',
            },
            'test1<div>test2</div> <!--test3-->\n<span>test4</span>test5'
        );
    });

    it('Has start fragment only', () => {
        runTest(
            '<div><!--StartFragment--><span>test</span></div>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html: '<div><!--StartFragment--><span>test</span></div>',
            },
            '<div><!--StartFragment--><span>test</span></div>'
        );
    });

    it('Has end fragment only', () => {
        runTest(
            '<div><span>test</span><!--EndFragment--></div>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html: '<div><span>test</span><!--EndFragment--></div>',
            },
            '<div><span>test</span><!--EndFragment--></div>'
        );
    });

    it('Has fragment comments', () => {
        runTest(
            '<div><!--StartFragment--><span>test</span><!--EndFragment--></div>',
            {
                htmlBefore: '<div>',
                htmlAfter: '</div>',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html: '<span>test</span>',
            },
            '<div><!--StartFragment--><span>test</span><!--EndFragment--></div>'
        );
    });

    it('Has metadata', () => {
        runTest(
            '<html a="b" c:d="e"><head><meta name="f" content="g"><meta name="h" content="i"></head><body><div>test</div></body></html>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: { a: 'b', 'c:d': 'e', f: 'g', h: 'i' },
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html:
                    '<html a="b" c:d="e"><head><meta name="f" content="g"><meta name="h" content="i"></head><body><div>test</div></body></html>',
            },
            '<div>test</div>'
        );
    });

    it('Has empty global CSS nodes', () => {
        runTest(
            '<style id="style1"></style><style id="style2"></style><div>test</div>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html: '<style id="style1"></style><style id="style2"></style><div>test</div>',
            },
            '<div>test</div>'
        );
    });

    itChromeOnly('Has global CSS rule', () => {
        runTest(
            '<style>.a {color:red} .b div, .c {font-size: 10pt}</style><div>test</div><style>test {border: none}</style>',
            {
                htmlBefore: '',
                htmlAfter: '',
                globalCssRules: [
                    {
                        selectors: ['.a'],
                        text: 'color: red;',
                    },
                    {
                        selectors: ['.b div', ' .c'],
                        text: 'font-size: 10pt;',
                    },
                    {
                        selectors: ['test'],
                        text: 'border: none;',
                    },
                ],
                metadata: {},
            },
            {
                htmlFirstLevelChildTags: ['DIV'],
                html:
                    '<style>.a {color:red} .b div, .c {font-size: 10pt}</style><div>test</div><style>test {border: none}</style>',
            },
            '<div>test</div>'
        );
    });
});
