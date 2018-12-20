import * as DomTestHelper from '../DomTestHelper';
import createRange from '../../selection/createRange';
import Position from '../../selection/Position';
import SelectionBlockScoper from '../../contentTraverser/SelectionBlockScoper';
import { BlockElement, ContentPosition, PositionType } from 'roosterjs-editor-types';

let testID = 'SelectionBlockScoper';

function createSelectionBlockScoper(
    rootNode: Node,
    selectionRange: Range,
    startPosition: ContentPosition
) {
    return new SelectionBlockScoper(rootNode, selectionRange, startPosition);
}

describe('SelectionBlockScoper getStartBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, range: Range, testBlockElement: BlockElement) {
        // Arrange
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);

        // Act
        let blockElement = scoper.getStartBlockElement();

        // Assert
        let isBlockElementEqual = blockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <p>example</p>, startBlockElement is of type NodeBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>example</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = www.example.com<br>, startBlockElement is of type startEndBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<br>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild,
            rootNode.lastChild
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = www.example.com<br>, scoper is part of startEndBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<br>');

        // range is 'www.example.com'
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild,
            rootNode.lastChild
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = <p>example</p>, scoper is part of NodeBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>example</p>');
        let startPosition = new Position(rootNode.firstChild.firstChild, PositionType.Begin);
        let endPosition = new Position(rootNode.firstChild.firstChild, 1);

        // range is 'e'
        let range = createRange(startPosition, endPosition);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper has multiple blockElements', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });
});

describe('SelectionBlockScoper getStartInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: Range,
        startPosition: ContentPosition,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let scoper = createSelectionBlockScoper(rootNode, range, startPosition);
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);

        // Act
        let inlineElement = scoper.getStartInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                start,
                end,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentPosition.Begin, PositionType.Begin, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentPosition.End, PositionType.Begin, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.SelectionStart, select whole inlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentPosition.SelectionStart, PositionType.Begin, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.SelectionStart, select partial inlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let start = new Position(rootNode.firstChild.firstChild, 3);
        let end = new Position(rootNode.lastChild.firstChild, PositionType.End);

        // range = 't1</span><span>part2</span>'
        let range = createRange(start, end);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentPosition.SelectionStart, 3, 5, node);
    });
});

describe('SelectionBlockScoper isBlockInScope()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: Range,
        startPosition: ContentPosition,
        testBlockElement: BlockElement,
        output: boolean
    ) {
        // Arrange
        let scoper = createSelectionBlockScoper(rootNode, range, startPosition);

        // Act
        let isTestBlockInScope = scoper.isBlockInScope(testBlockElement);

        // Assert
        expect(isTestBlockInScope).toBe(output);
    }

    it('input = <p>part1</p><p>part2</p>, testBlockElement is startBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, ContentPosition.SelectionStart, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, testBlockElement is after startBlockElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, ContentPosition.SelectionStart, testBlockElement, false);
    });
});

describe('SelectionBlockScoper trimInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p><p>part2</p>, inlineElement inside startBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);

        // inlineElement is 'part1'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBe(inlineElement);
    });

    it('input = <p>part1</p><p>part2</p>, inlineElement outside startBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);

        // inlineElement is 'part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.lastChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBe(null);
    });
});
