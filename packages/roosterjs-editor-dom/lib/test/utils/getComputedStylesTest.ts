import * as DomTestHelper from '../DomTestHelper';
import getComputedStyles from '../../utils/getComputedStyles';

describe('getComputedStyle()', () => {
    let testID = 'getComputedStyle';

    it('input = ["", "font-size"]', () => {
        runTest(['', 'font-size'], []);
    });

    it('input = ["test", "font-size"]', () => {
        runTest(['test', 'font-size'], []);
    });

    it('input = [<div style="font-size:12px">Test</div>, "font-size"]', () => {
        runTest(['<div style="font-size:12px">Test</div>', 'font-size'], ['12px']);
    });

    function runTest(input: [string, string], output: string[]) {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(testID, input[0]);

        // Act
        DomTestHelper.runTestMethod2([testDiv.firstChild, input[1]], output, getComputedStyles);

        // Remove the element
        DomTestHelper.removeElement(testID);
    }
});
