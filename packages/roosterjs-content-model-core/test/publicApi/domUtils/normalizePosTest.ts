import { normalizePos } from '../../../lib/publicApi/domUtils/normalizePos';

describe('normalizePos()', () => {
    function runTest(
        input: string,
        getNode: (root: Node) => Node,
        inputOffset: number,
        expectNodeValue: string,
        expectOffset: number
    ) {
        const div = document.createElement('div');
        document.body.appendChild(div);

        div.innerHTML = input;
        const inputNode = getNode(div);

        const { node, offset } = normalizePos(inputNode, inputOffset);

        let value = node.nodeType == Node.TEXT_NODE ? node.nodeValue : node.textContent;

        expect(value).toBe(expectNodeValue, 'NodeValue');
        expect(offset).toBe(expectOffset, 'Offset');

        document.body.removeChild(div);
    }

    it('DIV - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            0,
            'test2',
            0
        );
    });
    it('DIV - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            1,
            'test2',
            5
        );
    });
    it('DIV - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1'),
            2,
            'test2',
            5
        );
    });
    it('Text - Begin', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            0,
            'test2',
            0
        );
    });
    it('Text - End', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            5,
            'test2',
            5
        );
    });
    it('Text - With offset', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            2,
            'test2',
            2
        );
    });
    it('Text - With offset out of range', () => {
        runTest(
            'test1<div id=id1>test2</div>test3',
            () => document.getElementById('id1').firstChild,
            10,
            'test2',
            5
        );
    });
    it('VOID - Begin', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 0, '', 0);
    });
    it('VOID - End', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 1, '', 0);
    });
    it('VOID - With offset', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 0, '', 0);
    });
    it('VOID - With offset out of range', () => {
        runTest('test1<img id=id1>test3', () => document.getElementById('id1'), 2, '', 0);
    });
});
