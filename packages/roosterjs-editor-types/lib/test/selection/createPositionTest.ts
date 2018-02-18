import Position, { PositionType } from '../../selection/Position';

function runTest(
    testName: string,
    node: Node,
    offset: number | PositionType,
    normalize: boolean,
    expectNode: Node,
    expectOffset: number,
    expectIsAtEnd: boolean
) {
    let position = Position.create(node, offset);
    if (normalize) {
        position = Position.normalize(position);
    }

    expect(position.node).toBe(expectNode || node, `Test ${testName}.Node`);
    expect(position.offset).toBe(expectOffset, `Test ${testName}.Offset`);
    expect(position.isAtEnd).toBe(expectIsAtEnd, `Test ${testName}.IsAtEnd`);
}

function fromHtml(html: string): Node {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.firstChild;
}

describe('createPosition test', () => {
    it('Create Position from text node', () => {
        let node = fromHtml('TEST');
        runTest('1.1', node, Position.Begin, false, null, 0, false);
        runTest('1.2', node, Position.End, false, null, 4, true);
        runTest('1.3', node, 2, false, null, 2, false);
        runTest('1.4', node, 4, false, null, 4, true);
        runTest('1.5', node, 5, false, null, 4, true);
        runTest('1.6', node, -1, false, null, 0, false);
        runTest('1.7', node, Position.Before, false, node.parentNode, 0, false);
        runTest('1.8', node, Position.After, false, node.parentNode, 1, true);
    });
    it('Create Position from text node and normalize', () => {
        let node = fromHtml('TEST');
        runTest('2.1', node, Position.Begin, true, null, 0, false);
        runTest('2.2', node, Position.End, true, null, 4, true);
        runTest('2.3', node, 2, true, null, 2, false);
        runTest('2.4', node, 4, true, null, 4, true);
        runTest('2.5', node, 5, true, null, 4, true);
        runTest('2.6', node, -1, true, null, 0, false);
        runTest('2.7', node, Position.Before, true, node, 0, false);
        runTest('2.8', node, Position.After, true, node, 4, true);
    });
    it('Create Position from element', () => {
        let root = fromHtml('<div><div>TEST1</div>TEST<div>TEST3</div></div>');
        let node = root.firstChild;
        runTest('3.1', node, Position.Begin, false, null, 0, false);
        runTest('3.2', node, Position.End, false, null, 1, true);
        runTest('3.3', node, 2, false, null, 1, true);
        runTest('3.4', node, -1, false, null, 0, false);
        runTest('3.5', node, Position.Before, false, root, 0, false);
        runTest('3.6', node, Position.After, false, root, 1, false);
    });
    it('Create Position from element and normalize', () => {
        let root = fromHtml('<div><div>TEST1</div>TEST<div>TEST3</div></div>');
        let node = root.firstChild;
        let resultNode = node.firstChild;
        runTest('4.1', node, Position.Begin, true, resultNode, 0, false);
        runTest('4.2', node, Position.End, true, resultNode, 5, true);
        runTest('4.3', node, 2, true, resultNode, 5, true);
        runTest('4.4', node, -1, true, resultNode, 0, false);
        runTest('4.5', node, Position.Before, true, resultNode, 0, false);
        runTest('4.6', node, Position.After, true, node.nextSibling, 0, false);
    });
});
