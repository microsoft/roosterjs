import sanitizeHtml from '../../utils/sanitizeHtml';

describe('sanitizeHtml', () => {
    function runTest(source: string, exp: string) {
        let result = sanitizeHtml(source);
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
