import * as DomTestHelper from '../DomTestHelper';
import Position from '../../selection/Position';
import { PositionType } from 'roosterjs-editor-types';
import {
    getFirstInlineElement,
    getLastInlineElement,
} from '../../inlineElements/getFirstLastInlineElement';

let testID = 'getFirstLastInlineElement';

describe('getInlineElement getFirstInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node, startOffset: number, endOffset: number) {
        // Arrange
        let start = new Position(testNode, startOffset);
        let end = new Position(testNode, endOffset);

        // Act
        let inlineElement = getFirstInlineElement(rootNode);

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
        let start = new Position(testNode, startOffset);
        let end = new Position(testNode, endOffset);

        // Act
        let inlineElement = getLastInlineElement(rootNode);

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
