import * as DomTestHelper from '../DomTestHelper';
import Position from '../../selection/Position';
import { InlineElement, PositionType } from 'roosterjs-editor-types';
import getNextPreviousInlineElement from '../../inlineElements/getNextPreviousInlineElement';

let testID = 'getNextPreviousInlineElement';

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
        let start = new Position(testNode, startOffset);
        let end = new Position(testNode, endOffset);

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                start,
                end,
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
        let start = new Position(testNode, startOffset);
        let end = new Position(testNode, endOffset);

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                start,
                end,
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
