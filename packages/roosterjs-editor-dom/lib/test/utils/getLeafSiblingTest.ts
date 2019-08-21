import * as DomTestHelper from '../DomTestHelper';
import {
    getNextLeafSibling,
    getPreviousLeafSibling,
    getLeafSibling,
} from '../../utils/getLeafSibling';

let testID = 'getLeafSibling';

describe('getLeafSibling getLeafSibling()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        startNode: Node,
        testNextSiblingNode: Node,
        testPreviousSiblingNode: Node
    ) {
        // Act
        let nextLeafNode = getLeafSibling(rootNode, startNode, true);
        let previousLeafNode = getLeafSibling(rootNode, startNode, false);

        // Assert
        expect(nextLeafNode).toBe(testNextSiblingNode);
        expect(previousLeafNode).toBe(testPreviousSiblingNode);
    }

    it('input = <div>www.example.com</div>, nextLeafSibling = null, previousLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null, null);
    });

    it('input = <p><br></p>, nextLeafSibling = null, previousLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null, null);
    });

    it('input = <div>abc<br>123</div>, nextLeafSibling = 123, previousLeafSibling = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.firstChild.nextSibling,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.firstChild
        );
    });

    it('input = <div>abc<br><div>123</div></div>, nextLeafSibling = 123, previousLeafSibling = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<br><div>123</div></div>'
        );

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.firstChild.nextSibling,
            rootNode.firstChild.lastChild.firstChild,
            rootNode.firstChild.firstChild
        );
    });
});

describe('getLeafSibling getNextLeafSibling()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, startNode: Node, testNode: Node) {
        // Act
        let leafNode = getNextLeafSibling(rootNode, startNode);

        // Assert
        expect(leafNode).toBe(testNode);
    }

    it('input = <div>www.example.com</div>, nextLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null);
    });

    it('input = <p><br></p>, nextLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null);
    });

    it('input = <div>abc<br>123</div>, nextLeafSibling = <br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
    });

    it('input = <div>abc<div>123</div></div>, nextLeafSibling = 123', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.lastChild.firstChild
        );
    });
});

describe('getLeafSibling getPreviousLeafSibling()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, startNode: Node, testNode: Node) {
        // Act
        let leafNode = getPreviousLeafSibling(rootNode, startNode);

        // Assert
        expect(leafNode).toBe(testNode);
    }

    it('input = <div>www.example.com</div>, previousLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null);
    });

    it('input = <p><br></p>, previousLeafSibling = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild, null);
    });

    it('input = <div>abc<br>123</div>, previousLeafSibling = <br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild.previousSibling
        );
    });

    it('input = <div>abc<div>123</div></div>, previousLeafSibling = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );

        runTest(
            rootNode.firstChild,
            rootNode.firstChild.lastChild.firstChild,
            rootNode.firstChild.firstChild
        );
    });
});
