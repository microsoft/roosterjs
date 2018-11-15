import getElementOrParentElement from '../../utils/getElementOrParentElement';

describe('getElementOrParentElement()', () => {
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
        let result = getElementOrParentElement(fromNode);
        expect(result).toBe(expectNode(div), `case index: ${caseIndex}`);
        document.body.removeChild(div);
    }

    it('getElementOrParentElement()', () => {
        runTest(0, '', () => null, () => null);
        runTest(1, 'test', root => root.firstChild, root => root);
        runTest(2, '<div></div>', root => root.firstChild, root => root.firstChild as HTMLElement);
        runTest(3, '<!--test-->', root => root.firstChild, root => root);
    });
});
