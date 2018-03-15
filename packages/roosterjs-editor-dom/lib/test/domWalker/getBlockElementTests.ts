import * as DomTestHelper from '../DomTestHelper';
import getBlockElementAtNode from '../../blockElements/getBlockElementAtNode';
import BlockElement from '../../blockElements/BlockElement';
import {
    getNextBlockElement,
    getPreviousBlockElement,
} from '../../blockElements/getNextPreviousBlockElement';

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
});

describe('getBlockElement getNextBlockElement', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentBlockElement: BlockElement,
        testBlockElement: BlockElement
    ) {
        // Act
        let blockElement = getNextBlockElement(rootNode, currentBlockElement);

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, nextBlockElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let nextBlockElement = getNextBlockElement(rootNode, currentBlockElement);

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p><br></p>, nextBlockElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let nextBlockElement = getNextBlockElement(rootNode, currentBlockElement);

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <div>abc<br>123</div>, nextBlockElement = 123', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, currentBlockElement, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, nextBlockElement = <div>123</div>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild
        );
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, currentBlockElement, testBlockElement as BlockElement);
    });
});

describe('getBlockElement getPreviousBlockElement', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentBlockElement: BlockElement,
        testBlockElement: BlockElement
    ) {
        // Act
        let blockElement = getPreviousBlockElement(rootNode, currentBlockElement);

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, previousBlockElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let previousBlockElement = getPreviousBlockElement(rootNode, currentBlockElement);

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <p><br></p>, previousBlockElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let previousBlockElement = getPreviousBlockElement(rootNode, currentBlockElement);

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <div>abc<br>123</div>, previousBlockElement = abc<br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild.nextSibling,
            rootNode.firstChild.lastChild
        );

        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
        runTest(rootNode, currentBlockElement, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, previousBlockElement = abc', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );

        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild
        );
        runTest(rootNode, currentBlockElement, testBlockElement as BlockElement);
    });
});
