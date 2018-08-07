import * as DomTestHelper from '../DomTestHelper';
import { getComputedStyle } from '../../utils/getComputedStyles';

describe('getComputedStyle()', () => {
    let testID = 'getComputedStyle';

    it('input = ["", "font-size"]', () => {
        runTest(['', 'font-size'], '');
    });

    it('input = ["test", "font-size"]', () => {
        runTest(['test', 'font-size'], '12pt');
    });

    it('input = [<div style="font-size:16px">Test</div>, "font-size"]', () => {
        runTest(['<div style="font-size:16px">Test</div>', 'font-size'], '12pt');
    });

    function runTest(input: [string, string], output: string) {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(testID, input[0]);

        // Act
        DomTestHelper.runTestMethod2([testDiv.firstChild, input[1]], output, getComputedStyle);

        // Remove the element
        DomTestHelper.removeElement(testID);
    }
});
