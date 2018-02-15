import * as DomTestHelper from '../DomTestHelper';
import contains from '../../utils/contains';

describe('contains()', () => {
    let testID = 'contains';

    it('container = null, contained = null', () => {
        runTest(null, null, null);
    });

    it('container = null, contained = not null', () => {
        runTest(null, DomTestHelper.createElementFromContent(testID, 'test'), null);
    });

    it('container = not null, contained = null', () => {
        runTest(DomTestHelper.createElementFromContent(testID, 'test'), null, null);
    });

    it('container = <div>test</div>, contained = test', () => {
        let container = DomTestHelper.createElementFromContent(testID, 'test');
        runTest(container, container.firstChild, true);
    });

    it('container = test, contained = <div>test</div>', () => {
        let container = DomTestHelper.createElementFromContent(testID, 'test');
        runTest(container.firstChild, container, false);
    });

    it('container and contained are not contained', () => {
        let container = DomTestHelper.createElementFromContent(testID, '<div></div><div></div>');
        runTest(container.firstChild, container.lastChild, false);
    });

    function runTest(container: Node, contained: Node, output: boolean) {
        DomTestHelper.runTestMethod2([container, contained], output, contains);
        DomTestHelper.removeElement(testID);
    }
});
