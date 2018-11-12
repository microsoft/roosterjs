import * as DomTestHelper from '../DomTestHelper';
import Position from '../../selection/Position';
import { InlineElement, PositionType } from 'roosterjs-editor-types';
import {
    getInlineElementAtNode,
    getFirstInlineElement,
    getLastInlineElement,
    getNextPreviousInlineElement,
} from '../../blockElements/BlockElement';

let testID = 'getInlineElement';

describe('getInlineElement getInlineElementAtNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        node: Node,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = new Position(testNode, startOffset);
        let endPoint = new Position(testNode, endOffset);

        // Act
        let inlineElement = getInlineElementAtNode(rootNode, node);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, inlineElementAtNode = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(
            rootNode,
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            PositionType.Begin,
            15
        );
    });

    it('input = <p><br></p>, inlineElementAtNode = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(
            rootNode,
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            PositionType.Begin,
            PositionType.End
        );
    });

    it('input = <div>abc<br>123</div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild,
            PositionType.Begin,
            3
        );
    });

    it('input = <div>abc<div>123</div></div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild,
            PositionType.Begin,
            3
        );
    });
});

describe('getInlineElement getFirstInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node, startOffset: number, endOffset: number) {
        // Arrange
        let startPoint = new Position(testNode, startOffset);
        let endPoint = new Position(testNode, endOffset);

        // Act
        let inlineElement = getFirstInlineElement(rootNode);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, firstInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, 15);
    });

    it('input = <p><br></p>, firstInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, PositionType.End);
    });

    it('input = <div>abc<br>123</div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, 3);
    });

    it('input = <div>abc<div>123</div></div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, 3);
    });
});

describe('getInlineElement getLastInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node, startOffset: number, endOffset: number) {
        // Arrange
        let startPoint = new Position(testNode, startOffset);
        let endPoint = new Position(testNode, endOffset);

        // Act
        let inlineElement = getLastInlineElement(rootNode);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, lastInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, 15);
    });

    it('input = <p><br></p>, lastInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, PositionType.Begin, PositionType.End);
    });

    it('input = <div>abc<br>123</div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.lastChild, PositionType.Begin, 3);
    });

    it('input = <div>abc<div>123</div></div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.lastChild.firstChild, PositionType.Begin, 3);
    });
});

describe('getInlineElement getNextInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = new Position(testNode, startOffset);
        let endPoint = new Position(testNode, endOffset);

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, nextInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let nextInline = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(nextInline).toBe(null);
    });

    it('input = <p><br></p>, nextInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let nextInline = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(nextInline).toBe(null);
    });

    it('input = <div>abc<br>123</div>, nextInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.firstChild.nextSibling,
            PositionType.Begin,
            PositionType.End
        );
    });

    it('input = <div>abc<div>123</div></div>, nextInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.lastChild.firstChild,
            PositionType.Begin,
            3
        );
    });
});

describe('getInlineElement getPreviousInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = new Position(testNode, startOffset);
        let endPoint = new Position(testNode, endOffset);

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, previousInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let previousInline = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(previousInline).toBe(null);
    });

    it('input = <p><br></p>, previousInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let previousInline = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(previousInline).toBe(null);
    });

    it('input = <div>abc<br>123</div>, previousInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.lastChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.firstChild.nextSibling,
            PositionType.Begin,
            PositionType.End
        );
    });

    it('input = <div>abc<div>123</div></div>, previousInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.lastChild,
            rootNode
        );
        runTest(rootNode, currentInline, rootNode.firstChild.firstChild, PositionType.Begin, 3);
    });
});
