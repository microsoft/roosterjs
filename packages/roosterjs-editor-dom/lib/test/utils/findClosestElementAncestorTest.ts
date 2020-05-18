import findClosestElementAncestor from '../../utils/findClosestElementAncestor';

describe('findClosestElementAncestor()', () => {
    function runTest(
        caseIndex: number,
        input: string,
        fromNodeCallback: (root: HTMLElement) => Node,
        expectNode: (root: HTMLElement) => HTMLElement
    ) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = input;
        let fromNode = fromNodeCallback(div);
        let result = findClosestElementAncestor(fromNode);
        expect(result).toBe(expectNode(div), `case index: ${caseIndex}`);
        document.body.removeChild(div);
    }

    it('findClosestElementAncestor()', () => {
        runTest(
            0,
            '',
            () => null,
            () => null
        );
        runTest(
            1,
            'test',
            root => root.firstChild,
            root => root
        );
        runTest(
            2,
            '<div></div>',
            root => root.firstChild,
            root => root.firstChild as HTMLElement
        );
        runTest(
            3,
            '<!--test-->',
            root => root.firstChild,
            root => root
        );
    });
});

describe('findClosestElementAncestor() with selector', () => {
    function runTest(html: string, getStartNode: () => Node, selector: string, expectedId: string) {
        let div = document.createElement('div');
        document.body.appendChild(div);
        div.innerHTML = html;

        let node = getStartNode();
        let element = findClosestElementAncestor(node, div, selector);
        let id = element ? element.id : null;
        expect(id).toBe(expectedId);

        node = getStartNode();
        element = findClosestElementAncestor(node, null, selector);
        id = element ? element.id : null;
        expect(id).toBe(expectedId);

        document.body.removeChild(div);
    }

    function $(id: string): HTMLElement {
        return document.getElementById(id);
    }

    it('get direct parent element', () => {
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a').firstChild, null, 'a');
    });

    it('get self element', () => {
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), null, 'a');
    });

    it('get ancestor by tag', () => {
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), 'A', 'a');
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), 'DIV', 'div');
    });

    it('get ancestor by tags', () => {
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), 'A,B', 'a');
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), 'DIV,A', 'a');
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a'), 'DIV,B', 'div');
    });

    it('no result', () => {
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a').firstChild, 'B', null);
        runTest('<div id="div"><a id="a">link</a></div>', () => $('a').firstChild, 'B,I', null);
    });
});
