import * as DomTestHelper from '../DomTestHelper';
import Position from '../../selection/Position';
import { PositionType } from 'roosterjs-editor-types';
import getInlineElementAtNode from '../../inlineElements/getInlineElementAtNode';

let testID = 'getInlineElementAtNode';

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
        let start = new Position(testNode, startOffset);
        let end = new Position(testNode, endOffset);

        // Act
        let inlineElement = getInlineElementAtNode(rootNode, node);

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
