import HtmlSanitizer from '../../lib/htmlSanitizer/HtmlSanitizer';

describe('sanitizeHtml', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer();
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Null input', () => {
        runTest(null, '');
        runTest('', '');
    });

    it('Valid HTML', () => {
        runTest('<b>Test</b>', '<b>Test</b>');
        runTest(
            '<div><span>test 1</span>test 2<span>test 3</span></div>',
            '<div><span>test 1</span>test 2<span>test 3</span></div>'
        );
    });

    it('Invalid HTML', () => {
        runTest('<html><html>', '');
        runTest('<test<test<test a', '');
    });

    it('Html contains global css', () => {
        runTest(
            '<style>div {color: red}</style><div style="font-size:10px">test</div>',
            '<div style="color:red;font-size:10px">test</div>'
        );
        runTest(
            '<html><head><style>.a .b{color: red} .b:hover {color:blue}</style></head><body><div class=a>a<div class=b style="font-size:10px">test</div></div></body></html>',
            '<div>a<div style="color:red;font-size:10px">test</div></div>'
        );
    });
    it('Html contains script', () => {
        runTest('test<script>alert("test")</script>', 'test');
        runTest('test1<object></object>test2', 'test1test2');
        runTest('test3<scr<script></script>ipt>alert("test")</script>test4', 'test3');
    });
    it('Html contains event handler', () => {
        runTest('<div onclick=alert("test")>bb</div>aa', '<div>bb</div>aa');
        runTest('aa<a href=javascript:alert("test")>cc</a>bb', 'aa<a>cc</a>bb');
        runTest('aa<a href="javas\nc\nr\ni\np\nt\n: alert("test")">cc</a>bb', 'aa<a>cc</a>bb');
        runTest('aa<form action=/>cc</form>bb', 'aa<span>cc</span>bb');
    });
    it('Html contains unnecessary CSS', () => {
        runTest(
            '<span style="color:red">aa<span style="color:red">bb</span>cc</span>',
            '<span style="color:red">aa<span>bb</span>cc</span>'
        );
        runTest(
            '<span style="color:red">aa<span style="color:blue">bb</span>cc</span>',
            '<span style="color:red">aa<span style="color:blue">bb</span>cc</span>'
        );
    });
    it('Html contains disallowed CSS', () => {
        runTest(
            '<span style="color:red; position:absolute">aa</span>',
            '<span style="color:red">aa</span>'
        );
        runTest(
            '<span style="color:red; width:expression(0)">aa</span>',
            '<span style="color:red">aa</span>'
        );
    });
    it('Html contains disallowed attributes', () => {
        runTest(
            '<span id="span1" dir="ltr" onclick="func()">aa</span>',
            '<span dir="ltr">aa</span>'
        );
    });
    it('Html contains comments', () => {
        runTest('<div>aa</div><!-- html-comment --><div>bb</div>', '<div>aa</div><div>bb</div>');
    });
    it('Html contains CSS with escaped quoted values', () => {
        let testIn: string =
            "<span style='background:url" +
            '(&quot;https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31&quot)' +
            "'>aa</span>";
        let testOut: string =
            '<span style="background:url(&quot;https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31&quot;)">aa</span>';

        runTest(testIn, testOut);
    });
    it('Html contains CSS with double quoted values', () => {
        let testIn: string =
            "<span style='background:url" +
            '("https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31")' +
            "'>aa</span>";
        let testOut: string =
            '<span style="background:url(&quot;https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31&quot;)">aa</span>';

        runTest(testIn, testOut);
    });
    it('Html contains CSS with single quoted values', () => {
        let testIn: string =
            '<span style="background:url' +
            "('https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31')" +
            '">aa</span>';

        runTest(testIn, testIn);
    });
});

describe('sanitizeHtml with elementCallback', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            elementCallbacks: {
                A: () => false, // Remove all <A> t ag
                B: b => b.innerHTML.length > 1,
                SCRIPT: () => true,
            },
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Valid HTML', () => {
        runTest('<b>a</b><b>Test</b>', '<b>Test</b>');
        runTest(
            '<div><span><a>te</a>st 1</span>test 2<span>test 3</span></div>',
            '<div><span>st 1</span>test 2<span>test 3</span></div>'
        );
    });

    it('Preserve SCRIPT tag since we want to', () => {
        runTest('test 1<script>test();</script>test 2', 'test 1<script>test();</script>test 2');
    });
});

describe('sanitizeHtml with attributeCallback', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            attributeCallbacks: {
                href: value => null, // Remove HREF attribute
                src: value => value + value, // Double the value
                checked: () => 'checked',
            },
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Valid HTML', () => {
        runTest('test 1 <a href="test">test 2</a>', 'test 1 <a>test 2</a>');
        runTest('test 1 <img src="mysrc"> test 2', 'test 1 <img src="mysrcmysrc"> test 2');
        runTest(
            'test 1 <input type=checkbox checked>test 3',
            'test 1 <input type="checkbox" checked="checked">test 3'
        );
    });
});

describe('sanitizeHtml with styleCallback', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            cssStyleCallbacks: {
                color: value => value == 'red',
                ['z-index']: value => parseInt(value) > 1,
            },
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Valid HTML', () => {
        runTest(
            '<span style="z-index: 1; color: red; font-size: 10px;">1</span><span style="z-index: 2; color: black">2</span>',
            '<span style="color:red;font-size:10px">1</span><span style="z-index:2">2</span>'
        );
    });

    it('position should be removed', () => {
        runTest(
            '<span style="position: absolute">1</span><span style="position: relative">2</span>',
            '<span>1</span><span>2</span>'
        );
    });

    it('width in DIV or LI should be removed', () => {
        runTest(
            '<span style="display: inline-block; width: 10px">1</span><div style="width: 10px;">2</div><ul><li style="width: 10px">3</li></ul>',
            '<span style="display:inline-block;width:10px">1</span><div>2</div><ul><li>3</li></ul>'
        );
    });
});

describe('sanitizeHtml with additionalAllowedTags, additionalAllowedAttributes', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            additionalTagReplacements: { TEST1: '*', OBJECT: '*' },
            additionalAllowedAttributes: ['prop1', 'onclick'],
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Tags', () => {
        runTest(
            '<test1></test1><test2></test2><object></object><img><script></script>',
            '<test1></test1><object></object><img>'
        );
    });

    it('Attributes', () => {
        runTest(
            '<span prop1 prop2 title="test" onclick="" onkeydown=""></span>',
            '<span prop1="" title="test" onclick=""></span>'
        );
    });
});

describe('sanitizeHtml with additionalDefaultStyleValues', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            additionalDefaultStyleValues: {
                width: '10px',
            },
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('default styles', () => {
        runTest(
            '<div style="width: 10px; height: 10px; border-bottom-color: rgb(0, 0, 0); border-left-color: red"></div>',
            '<div style="height:10px;border-left-color:red"></div>'
        );
    });
});

describe('sanitizeHtml with additionalGlobalStyleNodes', () => {
    let sanitizer: HtmlSanitizer;
    let styleNode: HTMLStyleElement;

    beforeAll(() => {
        styleNode = document.createElement('style');
        styleNode.innerHTML = '.test {color: red}';
        document.head.appendChild(styleNode);
        sanitizer = new HtmlSanitizer({
            additionalGlobalStyleNodes: [styleNode],
        });
    });

    afterAll(() => {
        document.head.removeChild(styleNode);
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('global styles', () => {
        runTest('<div class="test"></div>', '<div style="color:red"></div>');
    });

    it('global styles with inline style', () => {
        runTest(
            '<div class="test" style="font-size: 10px"></div>',
            '<div style="color:red;font-size:10px"></div>'
        );
    });

    it('global styles with conflict inline style', () => {
        runTest('<div class="test" style="color: blue"></div>', '<div style="color:blue"></div>');
    });
});

describe('sanitizeHtml with preserveHtmlComments', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            preserveHtmlComments: true,
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('preserve HTML comments', () => {
        runTest(
            '<div>aa</div><!-- html-comment --><div>bb</div>',
            '<div>aa</div><!-- html-comment --><div>bb</div>'
        );
    });
});

describe('sanitizeHtml with white-space style', () => {
    function runTest(source: string, exp: string) {
        let sanitizer: HtmlSanitizer = new HtmlSanitizer();
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('handle normal', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<div style="white-space: normal">  line  \n  2  </div>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:normal">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle nowrap', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<div style="white-space: nowrap">  line  \n  2  </div>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:nowrap">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle pre', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<div style="white-space: pre">  line  \n  2  </div>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre">&nbsp; line &nbsp;\n&nbsp; 2 &nbsp;</div>  line \n 3  </div>'
        );
    });

    it('handle pre-line', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<div style="white-space:pre-line">  line  \n  2  </div>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre-line">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle pre-wrap', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<div style="white-space: pre-wrap">  line  \n  2  </div>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre-wrap">&nbsp; line &nbsp;\n&nbsp; 2 &nbsp;</div>  line \n 3  </div>'
        );
    });

    it('handle PRE tag', () => {
        runTest(
            '<div>  line  \n  1  ' + '<pre>  line  \n  2  </pre>' + '  line \n 3  </div>',
            '<div>  line  \n  1  <pre>&nbsp; line &nbsp;\n&nbsp; 2 &nbsp;</pre>  line \n 3  </div>'
        );
    });

    it('handle PRE tag with style', () => {
        runTest(
            '<div>  line  \n  1  ' +
                '<pre style="white-space: normal">  line  \n  2  </pre>' +
                '  line \n 3  </div>',
            '<div>  line  \n  1  <pre style="white-space:normal">  line  \n  2  </pre>  line \n 3  </div>'
        );
    });
});

describe('sanitizeHtml with unknown/disabled tags and set unknownTagReplacement to *, keep unknown tags', () => {
    function runTest(source: string, exp: string) {
        let sanitizer: HtmlSanitizer = new HtmlSanitizer({
            unknownTagReplacement: '*',
        });
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Unknown tags, keep as it is', () => {
        runTest(
            '<div>line 1<aaa style="color:red">line2<br>line3</aaa>line4</div>',
            '<div>line 1<aaa style="color:red">line2<br>line3</aaa>line4</div>'
        );
    });

    it('Disabled tags, should remove', () => {
        runTest(
            '<div>line 1<object style="color:red">line2<br>line3</object>line4</div>',
            '<div>line 1line4</div>'
        );
    });
});

describe('sanitizeHtml with unknown/disabled tags and set unknownTagReplacement to invalid string, remove unknown tags', () => {
    function runTest(source: string, exp: string) {
        let sanitizer: HtmlSanitizer = new HtmlSanitizer({
            unknownTagReplacement: '!invalid!',
        });
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Unknown tags, keep as it is', () => {
        runTest(
            '<div>line 1<aaa style="color:red">line2<br>line3</aaa>line4</div>',
            '<div>line 1line4</div>'
        );
    });

    it('Disabled tags, should remove', () => {
        runTest(
            '<div>line 1<object style="color:red">line2<br>line3</object>line4</div>',
            '<div>line 1line4</div>'
        );
    });
});

describe('sanitizeHtml with unknown/disabled tags, replace with SPAN', () => {
    function runTest(source: string, exp: string) {
        let sanitizer: HtmlSanitizer = new HtmlSanitizer({
            unknownTagReplacement: 'SPAN',
        });
        let result = sanitizer.exec(source, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Unknown tags, convert to SPAN', () => {
        runTest(
            '<div>line 1<aaa style="color:red">line2<br>line3</aaa>line4</div>',
            '<div>line 1<span style="color:red">line2<br>line3</span>line4</div>'
        );
    });

    it('Disabled tags, should remove', () => {
        runTest(
            '<div>line 1<object style="color:red">line2<br>line3</object>line4</div>',
            '<div>line 1line4</div>'
        );
    });

    it('Make sure all allowed tags are really allowed', () => {
        const allowTags = 'H1,H2,H3,H4,H5,H6,P,ABBR,ADDRESS,B,BDI,BDO,BLOCKQUOTE,CITE,CODE,DEL,DFN,EM,FONT,I,INS,KBD,MARK,METER,PRE,PROGRESS,Q,RP,RT,RUBY,S,SAMP,SMALL,STRIKE,STRONG,SUB,SUP,TIME,TT,U,VAR,XMP,TEXTAREA,BUTTON,SELECT,OPTGROUP,OPTION,LABEL,FIELDSET,LEGEND,DATALIST,OUTPUT,MAP,CANVAS,FIGCAPTION,FIGURE,PICTURE,A,NAV,UL,OL,LI,DIR,UL,DL,DT,DD,MENU,MENUITEM,DIV,SPAN,HEADER,FOOTER,MAIN,SECTION,ARTICLE,ASIDE,DETAILS,DIALOG,SUMMARY,DATA'
            .toLowerCase()
            .split(',');

        allowTags.forEach(tag => {
            const html = `text before<${tag}>test text</${tag}>text after`;
            runTest(html, html);
        });
    });

    it('Make sure all allowed void tags are really allowed', () => {
        const allowTags = 'BR,HR,WBR,INPUT,IMG,AREA'.toLowerCase().split(',');

        allowTags.forEach(tag => {
            const html = `text before<${tag}>text after`;
            runTest(html, html);
        });
    });

    it('Make sure all allowed table tags are really allowed', () => {
        const html =
            '<table><caption>test table</caption><colgroup><col><col></colgroup><thead><tr><th>head1</th><th>head2</th></tr></thead><tbody><tr><td>body1</td><td>body2</td></tr><tr><td>body3</td><td>body4</td></tr></tbody><tfoot><tr><td>foot1</td><td>foot2</td></tr></tfoot></table>';

        runTest(html, html);
    });

    it('Make sure disallowed tags are really removed', () => {
        const disallowedTags = 'applet,audio,iframe,noscript,object,script,slot,style,template,title,video'.split(
            ','
        );
        disallowedTags.forEach(tag => {
            const html = `text before<${tag}>test text</${tag}>text after`;
            runTest(html, 'text beforetext after');
        });
    });

    it('Make sure disallowed void tags are really removed', () => {
        const disallowedTags = 'base,basefont,embed,frame,frameset,link,meta,param,source,track'.split(
            ','
        );
        disallowedTags.forEach(tag => {
            const html = `text before<${tag}>text after`;
            runTest(html, 'text beforetext after');
        });
    });

    it('Make sure tags with replacements are really replaced', () => {
        const disallowedTags = 'form'.split(',');
        disallowedTags.forEach(tag => {
            const html = `text before<${tag}>test text</${tag}>text after`;
            runTest(html, 'text before<span>test text</span>text after');
        });
    });
});
