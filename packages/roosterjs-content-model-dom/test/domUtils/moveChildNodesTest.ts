import { moveChildNodes, wrapAllChildNodes } from '../../lib/domUtils/moveChildNodes';

describe('moveChildNodes', () => {
    function htmlToDom(html: string) {
        let element = document.createElement('DIV');
        element.innerHTML = html;

        return element.firstChild as HTMLElement;
    }

    function runTest(
        targetHtml: string,
        sourceHtml: string,
        keepExisting: boolean,
        expectedTargetHtml: string
    ) {
        const source = htmlToDom(sourceHtml);
        const target = htmlToDom(targetHtml);

        moveChildNodes(target, source, keepExisting);

        const targetResult = target ? target.outerHTML : '';

        expect(targetResult).toBe(expectedTargetHtml);
    }

    it('null input', () => {
        runTest(null!, null!, true, '');
        runTest(null!, null!, false, '');
    });

    it('null target input', () => {
        runTest(null!, '<div><span>test</span></div>', true, '');
        runTest(null!, '<div><span>test</span></div>', false, '');
    });

    it('null source input', () => {
        runTest('<div><span>test</span></div>', null!, true, '<div><span>test</span></div>');
        runTest('<div><span>test</span></div>', null!, false, '<div></div>');
    });

    it('null source input', () => {
        runTest('<div><span>test</span></div>', null!, true, '<div><span>test</span></div>');
        runTest('<div><span>test</span></div>', null!, false, '<div></div>');
    });

    it('regular case', () => {
        runTest(
            '<div><span>test1</span><span>test2</span></div>',
            '<div><span>test3</span><span>test4</span></div>',
            false,
            '<div><span>test3</span><span>test4</span></div>'
        );
        runTest(
            '<div><span>test1</span><span>test2</span></div>',
            '<div><span>test3</span><span>test4</span></div>',
            true,
            '<div><span>test1</span><span>test2</span><span>test3</span><span>test4</span></div>'
        );
    });
});

describe('wrapAllChildNodes', () => {
    it('Single element, no child', () => {
        const div = document.createElement('div');
        const result = wrapAllChildNodes(div, 'span');

        expect(div.innerHTML).toBe('<span></span>');
        expect(result).toBe(div.firstChild as HTMLElement);
    });

    it('Single element, with child nodes', () => {
        const div = document.createElement('div');

        div.innerHTML = 'test<b>test2</b>test3';
        const result = wrapAllChildNodes(div, 'span');

        expect(div.innerHTML).toBe('<span>test<b>test2</b>test3</span>');
        expect(result).toBe(div.firstChild as HTMLElement);
    });
});
