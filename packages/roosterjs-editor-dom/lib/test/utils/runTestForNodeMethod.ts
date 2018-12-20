import * as DomTestHelper from '../DomTestHelper';

// Run test for node method like (Node) => any.
export default function runTestForNodeMethod(
    input: string,
    output: any,
    testMethod: (node: Node) => any,
    testID: string
) {
    // Arrange
    let testDiv = DomTestHelper.createElementFromContent(testID, input);

    // Act
    DomTestHelper.runTestMethod1(testDiv.firstChild, output, testMethod);

    // Clean up
    DomTestHelper.removeElement(testID);
}
