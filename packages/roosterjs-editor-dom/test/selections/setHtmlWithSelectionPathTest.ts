import setHtmlWithSelectionPath from '../../lib/selection/setHtmlWithSelectionPath';

describe('setHtmlWithSelectionPath', () => {
    it('null element', () => {
        const result = setHtmlWithSelectionPath(null, null);
        expect(result).toBeNull();
    });

    it('null html', () => {
        const node = document.createElement('span');
        node.innerText = 'test';
        const result = setHtmlWithSelectionPath(node, null);
        expect(node.innerHTML).toBe('');
        expect(result).toBeNull();
    });

    it('html without selection path', () => {
        const node = document.createElement('span');
        node.innerText = 'test';
        const result = setHtmlWithSelectionPath(node, 'test2');
        expect(node.innerHTML).toBe('test2');
        expect(result).toBeNull();
    });

    it('html with invalid selection path', () => {
        const node = document.createElement('span');
        node.innerText = 'test';
        const result = setHtmlWithSelectionPath(node, 'test2<!--test-->');
        expect(node.innerHTML).toBe('test2<!--test-->');
        expect(result).toBeNull();
    });

    it('html with invalid selection path 2', () => {
        const node = document.createElement('span');
        node.innerText = 'test';
        const result = setHtmlWithSelectionPath(node, 'test2<!--{}-->');
        expect(node.innerHTML).toBe('test2<!--{}-->');
        expect(result).toBeNull();
    });

    function removeComment(html: string) {
        return html.replace(/<--.*-->/g, '');
    }

    function runTest(
        html: string,
        expected: (
            root: Node
        ) => {
            startContainer: Node;
            startOffset: number;
            endContainer: Node;
            endOffset: number;
        }
    ) {
        const div = document.createElement('div');

        let range1 = setHtmlWithSelectionPath(div, html);
        let result1 = expected(div);
        expect(range1.startContainer).toBe(result1.startContainer);
        expect(range1.startOffset).toBe(result1.startOffset);
        expect(range1.endContainer).toBe(result1.endContainer);
        expect(range1.endOffset).toBe(result1.endOffset);

        html = removeComment(html);
        let range2 = setHtmlWithSelectionPath(div, html, removeComment);
        let result2 = expected(div);
        expect(range2.startContainer).toBe(result2.startContainer);
        expect(range2.startOffset).toBe(result2.startOffset);
        expect(range2.endContainer).toBe(result2.endContainer);
        expect(range2.endOffset).toBe(result2.endOffset);
    }

    it('Single node', () => {
        runTest('<div>test</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', root => ({
            startContainer: root.firstChild.firstChild,
            startOffset: 2,
            endContainer: root.firstChild.firstChild,
            endOffset: 2,
        }));
    });

    it('Single node with selection', () => {
        runTest('<div>test</div><!--{"start":[0,0,1],"end":[0,0,3]}-->', root => ({
            startContainer: root.firstChild.firstChild,
            startOffset: 1,
            endContainer: root.firstChild.firstChild,
            endOffset: 3,
        }));
    });

    it('Multiple nodes with selection', () => {
        runTest('<div>test</div><div>test2</div><!--{"start":[0,0,2],"end":[1,0,2]}-->', root => ({
            startContainer: root.firstChild.firstChild,
            startOffset: 2,
            endContainer: root.lastChild.firstChild,
            endOffset: 2,
        }));
    });
});
