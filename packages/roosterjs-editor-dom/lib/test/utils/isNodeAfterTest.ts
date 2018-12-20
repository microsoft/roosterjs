import * as DomTestHelper from '../DomTestHelper';
import isNodeAfter from '../../utils/isNodeAfter';

describe('isAfter()', () => {
    let testID = 'isAfter';

    it('node1 = null, node2 = null', () => {
        runTest(null, null, false);
    });

    it('node1 = null, node2 = not null', () => {
        runTest(null, DomTestHelper.createElementFromContent(testID, 'test'), false);
    });

    it('node1 = not null, node2 = null', () => {
        runTest(DomTestHelper.createElementFromContent(testID, 'test'), null, false);
    });

    it('node1 = <div>test</div>, node2 = test', () => {
        let container = DomTestHelper.createElementFromContent(testID, 'test');
        runTest(container, container.firstChild, false);
    });

    it('node1 is before node2', () => {
        let container = DomTestHelper.createElementFromContent(testID, '<div></div><div></div>');
        runTest(container.firstChild, container.lastChild, false);
    });

    it('node1 is after node2', () => {
        let container = DomTestHelper.createElementFromContent(testID, '<div></div><div></div>');
        runTest(container.lastChild, container.firstChild, true);
    });

    function runTest(node1: Node, node2: Node, output: boolean) {
        DomTestHelper.runTestMethod2([node1, node2], output, isNodeAfter);
        DomTestHelper.removeElement(testID);
    }
});
