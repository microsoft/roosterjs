import * as DomTestHelper from '../DomTestHelper';
import { BlockElement } from 'roosterjs-editor-types';
import getBlockElementAtNode from '../../blockElements/getBlockElementAtNode';

let testID = 'getBlockElement';

describe('getBlockElement getBlockElementAtNode', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, node: Node, testBlockElement: BlockElement) {
        // Act
        let blockElement = getBlockElementAtNode(rootNode, node);

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, blockElementAtNode = <div>www.example.com</div>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, rootNode.firstChild, testBlockElement as BlockElement);
    });

    it('input = <p><br></p>, blockElementAtNode = <p><br></p>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, rootNode.firstChild, testBlockElement as BlockElement);
    });

    it('input = <div>abc<br>123</div>, blockElementAtNode = abc<br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
        runTest(rootNode, rootNode.firstChild.firstChild, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, blockElementAtNode = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild
        );
        runTest(rootNode, rootNode.firstChild.firstChild, testBlockElement as BlockElement);
    });

    it('input = <div><br></div> blockElementAtNode = <BR>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div><br><br></div>');
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode.firstChild as HTMLElement,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild
        );
        runTest(rootNode, rootNode.firstChild.firstChild, testBlockElement as BlockElement);
    });
});
