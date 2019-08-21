import * as DomTestHelper from '../DomTestHelper';
import { getFirstLeafNode, getLastLeafNode } from '../../utils/getLeafNode';

let testID = 'getLeafNode';

describe('getLeafNode getFirstLeafNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node) {
        // Act
        let leafNode = getFirstLeafNode(rootNode);

        // Assert
        expect(leafNode).toBe(testNode);
    }

    it('input = <div>www.example.com</div>, firstLeafNode = www.example.com', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = <p><br></p>, firstLeafNode = <br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = <div>abc<br>123</div>, firstLeafNode = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = <div>abc<div>123</div></div>, firstLeafNode = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = "", firstLeafNode = null', () => {
        // Arrange
        let rootNode = document.createTextNode('');

        runTest(rootNode, null);
    });
});

describe('getLeafNode getLastLeafNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node) {
        // Act
        let leafNode = getLastLeafNode(rootNode);

        // Assert
        expect(leafNode).toBe(testNode);
    }

    it('input = <div>www.example.com</div>, lastLeafNode = www.example.com', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = <p><br></p>, lastLeafNode = <br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');

        runTest(rootNode.firstChild, rootNode.firstChild.firstChild);
    });

    it('input = <div>abc<br>123</div>, lastLeafNode = 123', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');

        runTest(rootNode.firstChild, rootNode.firstChild.lastChild);
    });

    it('input = <div>abc<div>123</div></div>, lastLeafNode = 123', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );

        runTest(rootNode.firstChild, rootNode.firstChild.lastChild.firstChild);
    });

    it('input = "", lastLeafNode = null', () => {
        // Arrange
        let rootNode = document.createTextNode('');

        runTest(rootNode, null);
    });
});
