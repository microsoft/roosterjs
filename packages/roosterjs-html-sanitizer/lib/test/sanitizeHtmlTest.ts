import HtmlSanitizer from '../sanitizer/HtmlSanitizer';

describe('sanitizeHtml', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer();
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, false, { color: '' });
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
            '<div style="color: red;font-size:10px">test</div>'
        );
        runTest(
            '<html><head><style>.a .b{color: red} .b:hover {color:blue}</style></head><body><div class=a>a<div class=b style="font-size:10px">test</div></div></body></html>',
            '<div>a<div style="color: red;font-size:10px">test</div></div>'
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
        runTest('aa<form action=/>cc</form>bb', 'aa<form>cc</form>bb');
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
        let result = sanitizer.exec(source, false, false, { color: '' });
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
        let result = sanitizer.exec(source, false, false, { color: '' });
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
            styleCallbacks: {
                color: value => value == 'red',
                ['z-index']: value => parseInt(value) > 1,
            },
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('Valid HTML', () => {
        runTest(
            '<span style="z-index: 1; color: red; font-size: 10px;">1</span><span style="z-index: 2; color: black">2</span>',
            '<span style="color: red; font-size: 10px">1</span><span style="z-index: 2">2</span>'
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
            '<span style="display: inline-block; width: 10px">1</span><div>2</div><ul><li>3</li></ul>'
        );
    });
});

describe('sanitizeHtml with additionalAllowedTags, additionalAllowAttributes', () => {
    let sanitizer: HtmlSanitizer;

    beforeAll(() => {
        sanitizer = new HtmlSanitizer({
            additionalAllowedTags: ['TEST1', 'OBJECT'],
            additionalAllowAttributes: ['prop1', 'onclick'],
        });
    });

    afterAll(() => {
        sanitizer = null;
    });

    function runTest(source: string, exp: string) {
        let result = sanitizer.exec(source, false, false, { color: '' });
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
        let result = sanitizer.exec(source, false, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('default styles', () => {
        runTest(
            '<div style="width: 10px; height: 10px; border-bottom-color: rgb(0, 0, 0); border-left-color: red"></div>',
            '<div style="height: 10px; border-left-color: red"></div>'
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
        let result = sanitizer.exec(source, false, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('global styles', () => {
        runTest('<div class="test"></div>', '<div style="color: red"></div>');
    });

    it('global styles with inline style', () => {
        runTest(
            '<div class="test" style="font-size: 10px"></div>',
            '<div style="color: red;font-size: 10px"></div>'
        );
    });

    it('global styles with conflict inline style', () => {
        runTest(
            '<div class="test" style="color: blue"></div>',
            '<div style="color: red;color: blue"></div>'
        );
    });
});

describe('sanitizeHtml with allowPreserveWhiteSpace', () => {
    function runTest(allowPreserveWhiteSpace: boolean, source: string, exp: string) {
        let sanitizer: HtmlSanitizer = new HtmlSanitizer({
            allowPreserveWhiteSpace,
        });
        let result = sanitizer.exec(source, false, false, { color: '' });
        expect(result).toBe(exp);
    }

    it('allowPreserveWhiteSpace', () => {
        runTest(
            true,
            '<div style="white-space: pre">   test   </div>',
            '<div style="white-space: pre">   test   </div>'
        );
    });

    it("don't allowPreserveWhiteSpace", () => {
        runTest(
            false,
            '<div style="white-space: pre">   test   </div>',
            '<div>&nbsp; &nbsp;test &nbsp; </div>'
        );
    });

    it('new line in PRE tag', () => {
        runTest(
            true,
            '<pre><span>line1</span>\n<span>line2</span></pre>',
            '<pre><span>line1</span>\n<span>line2</span></pre>'
        );
    });
});
