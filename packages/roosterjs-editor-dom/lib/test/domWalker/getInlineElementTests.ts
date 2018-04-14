import * as DomTestHelper from '../DomTestHelper';
import getInlineElementAtNode from '../../inlineElements/getInlineElementAtNode';
import {
    getInlineElementBefore,
    getInlineElementAfter,
} from '../../inlineElements/getInlineElementBeforeAfter';
import Position from '../../selection/Position';
import { PositionType } from 'roosterjs-editor-types';

let testID = 'getInlineElement';

describe('getInlineElement getInlineElementAtNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        node: Node,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = new Position(testNode, startOffset);
        let endPosition = new Position(testNode, endOffset);

        // Act
        let inlineElement = getInlineElementAtNode(node);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, inlineElementAtNode = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild, rootNode.firstChild.firstChild, 0, 15);
    });

    it('input = <p><br></p>, inlineElementAtNode = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild, rootNode.firstChild.firstChild, 0, PositionType.End);
    });

    it('input = <div>abc<br>123</div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, rootNode.firstChild.firstChild, 0, 3);
    });

    it('input = <div>abc<div>123</div></div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.firstChild, rootNode.firstChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getInlineElementBeforePoint()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        position: Position,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElementBeforePoint = getInlineElementBefore(rootNode, position);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementBeforePoint,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, position at beginning, inlineElementBeforePoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = new Position(rootNode.firstChild, 0);

        // Act
        let inlineElementBeforePoint = getInlineElementBefore(rootNode, position);

        // Assert
        expect(inlineElementBeforePoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementBeforePoint = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = new Position(rootNode.lastChild, 0);
        runTest(rootNode, position, 0, 3, rootNode.firstChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement before selection, inlineElementBeforePoint = www', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let position = new Position(rootNode.firstChild.firstChild, 3);
        runTest(rootNode, position, 0, 3, rootNode.firstChild.firstChild);
    });
});

describe('getInlineElement getInlineElementAfterPoint()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        position: Position,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElementAfterPoint = getInlineElementAfter(rootNode, position);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementAfterPoint,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, position at end, inlineElementAfterPoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = new Position(rootNode.lastChild, PositionType.End);

        // Act
        let inlineElementAfterPoint = getInlineElementAfter(rootNode, position);

        // Assert
        expect(inlineElementAfterPoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementAfterPoint = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = new Position(rootNode.firstChild, PositionType.End);
        runTest(rootNode, position, 0, 3, rootNode.lastChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement after position, inlineElementAfterPoint = com', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let position = new Position(rootNode.firstChild.firstChild, 12);
        runTest(rootNode, position, 12, 15, rootNode.firstChild.firstChild);
    });
});
