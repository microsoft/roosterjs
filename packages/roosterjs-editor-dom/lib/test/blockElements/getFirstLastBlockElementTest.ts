import * as DomTestHelper from '../DomTestHelper';
import { BlockElement } from 'roosterjs-editor-types';
import {
    getFirstBlockElement,
    getLastBlockElement,
} from '../../blockElements/getFirstLastBlockElement';

let testID = 'getFirstLastBlockElement';

describe('getBlockElement getFirstBlockElement', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testBlockElement: BlockElement) {
        // Act
        let blockElement = getFirstBlockElement(rootNode);

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, firstBlockElement = <div>www.example.com</div>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <p><br></p>, firstBlockElement = <p><br></p>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <div>abc<br>123</div>, firstBlockElement = abc<br>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, firstBlockElement = abc', () => {
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
        runTest(rootNode, testBlockElement as BlockElement);
    });
});

describe('getBlockElement getLastBlockElement', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testBlockElement: BlockElement) {
        // Act
        let blockElement = getLastBlockElement(rootNode);

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, lastBlockElement = <div>www.example.com</div>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <p><br></p>, lastBlockElement = <p><br></p>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <div>abc<br>123</div>, lastBlockElement = 123', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, lastBlockElement = <div>123</div>', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, testBlockElement as BlockElement);
    });
});
