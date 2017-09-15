import * as TestHelper from 'roosterjs-editor-api/lib/test/TestHelper';
import containsImage from '../../HtmlSnapshotUndo/containsImage';

describe('containsImage()', () => {
    let testID = 'containsImage';

    it('input is null', () => {
        let result = containsImage(null);
        expect(result).toBe(false);
    });

    it('input=text', () => {
        runTest('text', false);
    });

    it('input=<br/>', () => {
        runTest('<br/>', false);
    });

    it('input=<div></div>', () => {
        runTest('<div></div>', false);
    });

    it('input=<div><img/></div>', () => {
        runTest('<div><img/></div>', true);
    });

    it('input=<div><img/><br></div>', () => {
        runTest('<div><img/><br></div>', true);
    });

    it('input=<div><div><img/></div></div>', () => {
        runTest('<div><div><img/></div></div>', true);
    });

    it('input=<div><br></div>', () => {
        runTest('<div><br></div>', false);
    });

    function runTest(input: string, output: boolean) {
        runTestForNodeMethod(input, output, containsImage, testID);
    }
});

// Run test for node method like (Node) => any.
function runTestForNodeMethod(
    input: string,
    output: any,
    testMethod: (node: Node) => any,
    testID: string
) {
    // Arrange
    let testDiv = TestHelper.createElementFromContent(testID, input);

    // Act
    TestHelper.runTestMethod1(testDiv.firstChild, output, testMethod);

    // Clean up
    TestHelper.removeElement(testID);
}
