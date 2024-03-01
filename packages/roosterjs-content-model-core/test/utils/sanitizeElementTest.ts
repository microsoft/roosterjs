import { AllowedTags, DisallowedTags, sanitizeElement } from '../../lib/utils/sanitizeElement';

describe('sanitizeElement', () => {
    it('Allowed element, empty', () => {
        const element = document.createElement('div');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<div></div>');
        expect(result!.outerHTML).toBe('<div></div>');
    });

    it('Allowed element, with child', () => {
        const element = document.createElement('div');

        element.id = 'a';
        element.className = 'b c';
        element.innerHTML = 'test1<span>test2</span>test3';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe(
            '<div id="a" class="b c">test1<span>test2</span>test3</div>'
        );
        expect(result!.outerHTML).toBe('<div class="b c">test1<span>test2</span>test3</div>');
    });

    it('Empty element with disallowed tag', () => {
        const element = document.createElement('script');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<script></script>');
        expect(result).toBeNull();
    });

    it('Empty element with additional disallowed tag', () => {
        const element = document.createElement('div');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags.concat(['div']));

        expect(element.outerHTML).toBe('<div></div>');
        expect(result).toBeNull();
    });

    it('Empty element with additional allowed tag', () => {
        const element = document.createElement('test');

        const result = sanitizeElement(element, AllowedTags.concat('test'), DisallowedTags);

        expect(element.outerHTML).toBe('<test></test>');
        expect(result!.outerHTML).toBe('<test></test>');
    });

    it('Empty element with unrecognized tag', () => {
        const element = document.createElement('test');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<test></test>');
        expect(result!.outerHTML).toBe('<span></span>');
    });

    it('Empty element with entity element', () => {
        const element = document.createElement('div');

        element.className = '_Entity _EType_A _EId_B _EReadonly_1';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe('<div class="_Entity _EType_A _EId_B _EReadonly_1"></div>');
        expect(result!.outerHTML).toBe('<div class="_Entity _EType_A _EId_B _EReadonly_1"></div>');
    });

    it('Empty element with child node', () => {
        const element = document.createElement('div');

        element.id = 'a';
        element.style.color = 'red';

        element.innerHTML = '<span style="font-size: 10pt">test</span>test2<script></script>';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags);

        expect(element.outerHTML).toBe(
            '<div id="a" style="color: red;"><span style="font-size: 10pt">test</span>test2<script></script></div>'
        );
        expect(result!.outerHTML).toBe(
            '<div style="color:red"><span style="font-size:10pt">test</span>test2</div>'
        );
    });

    it('Empty element with style callback', () => {
        const element = document.createElement('div');

        element.style.color = 'red';
        element.style.position = 'absolute';

        const positionCallback = jasmine.createSpy('position').and.callFake(() => 'relative');

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, {
            position: positionCallback,
        });

        expect(element.outerHTML).toBe('<div style="color: red; position: absolute;"></div>');
        expect(result!.outerHTML).toBe('<div style="color:red;position:relative"></div>');
    });

    it('styleCallbacks', () => {
        const element = document.createElement('div');
        const sanitizerSpy = jasmine.createSpy('sanitizer').and.returnValue('green');

        element.style.color = 'red';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, {
            color: sanitizerSpy,
        });

        expect(result!.outerHTML).toBe('<div style="color:green"></div>');
        expect(sanitizerSpy).toHaveBeenCalledWith('red', 'div');
    });

    it('styleCallbacks with boolean', () => {
        const element = document.createElement('div');

        element.style.color = 'red';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, {
            color: false,
        });

        expect(result!.outerHTML).toBe('<div style=""></div>');
    });

    it('attributeCallbacks', () => {
        const element = document.createElement('div');
        const sanitizerSpy = jasmine.createSpy('sanitizer').and.returnValue('b');

        element.id = 'a';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, undefined, {
            id: sanitizerSpy,
        });

        expect(result!.outerHTML).toBe('<div id="b"></div>');
        expect(sanitizerSpy).toHaveBeenCalledTimes(1);
        expect(sanitizerSpy).toHaveBeenCalledWith('a', 'div');
    });

    it('attributeCallbacks with boolean', () => {
        const element = document.createElement('div');

        element.id = 'a';

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, undefined, {
            id: false,
        });

        expect(result!.outerHTML).toBe('<div></div>');
    });

    it('attributeCallbacks with child element', () => {
        const element = document.createElement('div');
        const child = document.createElement('span');
        const sanitizerSpy = jasmine
            .createSpy('sanitizer')
            .and.callFake((value: string) => value + value);

        element.id = 'a';
        child.id = 'b';
        element.appendChild(child);

        const result = sanitizeElement(element, AllowedTags, DisallowedTags, undefined, {
            id: sanitizerSpy,
        });

        expect(result!.outerHTML).toBe('<div id="aa"><span id="bb"></span></div>');
        expect(sanitizerSpy).toHaveBeenCalledTimes(2);
        expect(sanitizerSpy).toHaveBeenCalledWith('a', 'div');
        expect(sanitizerSpy).toHaveBeenCalledWith('b', 'span');
    });
});

describe('sanitizeHtml', () => {
    function runTest(source: string, exp: string) {
        const doc = new DOMParser().parseFromString(source, 'text/html');

        const result = sanitizeElement(doc.body, AllowedTags, DisallowedTags);

        expect(result!.innerHTML).toEqual(exp);
    }

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

    it('Html contains script', () => {
        runTest('test<script>alert("test")</script>', 'test');
        runTest('test1<object></object>test2', 'test1test2');
        runTest(
            'test3<scr<script></script>ipt>alert("test")</script>test4',
            'test3<span>ipt&gt;alert("test")test4</span>'
        );
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
            '<span style="color:red">aa<span style="color:red">bb</span>cc</span>'
        );
        runTest(
            '<span style="color:red">aa<span style="color:blue">bb</span>cc</span>',
            '<span style="color:red">aa<span style="color:blue">bb</span>cc</span>'
        );
    });

    it('Html contains disallowed CSS', () => {
        runTest(
            '<span style="color:red;position:absolute">aa</span>',
            '<span style="color:red;position:absolute">aa</span>'
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

    it('handle normal', () => {
        runTest(
            '<div>  line  \n  1  <div style="white-space:normal">  line  \n  2  </div>  line \n 3  </div>',
            '<div>  line  \n  1  <div style="">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle nowrap', () => {
        runTest(
            '<div>  line  \n  1  <div style="white-space: nowrap">  line  \n  2  </div>  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:nowrap">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle pre', () => {
        runTest(
            '<div>  line  \n  1  <div style="white-space: pre">  line  \n  2  </div>  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle pre-line', () => {
        runTest(
            '<div>  line  \n  1  <div style="white-space:pre-line">  line  \n  2  </div>  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre-line">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle pre-wrap', () => {
        runTest(
            '<div>  line  \n  1  <div style="white-space: pre-wrap">  line  \n  2  </div>  line \n 3  </div>',
            '<div>  line  \n  1  <div style="white-space:pre-wrap">  line  \n  2  </div>  line \n 3  </div>'
        );
    });

    it('handle PRE tag', () => {
        runTest(
            '<div>  line  \n  1  ' + '<pre>  line  \n  2  </pre>' + '  line \n 3  </div>',
            '<div>  line  \n  1  <pre>  line  \n  2  </pre>  line \n 3  </div>'
        );
    });

    it('handle PRE tag with style', () => {
        runTest(
            '<div>  line  \n  1  <pre style="white-space:normal">  line  \n  2  </pre>  line \n 3  </div>',
            '<div>  line  \n  1  <pre style="">  line  \n  2  </pre>  line \n 3  </div>'
        );
    });
});
