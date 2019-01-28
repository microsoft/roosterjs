import * as DomTestHelper from '../DomTestHelper';
import ContentTraverser from '../../contentTraverser/ContentTraverser';
import createRange from '../../selection/createRange';
import Position from '../../selection/Position';
import { BlockElement, ContentPosition, PositionType } from 'roosterjs-editor-types';

let testID = 'ContentTraverser';

describe('ContentTraverser currentBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(contentTraverser: ContentTraverser, testBlockElement: BlockElement) {
        // Act
        let currentBlockElement = contentTraverser.currentBlockElement;

        // Assert
        expect(currentBlockElement.equals(testBlockElement)).toBe(true);
    }

    it('input = <p>part1</p><p>part2</p>, scoper = BodyScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(ContentTraverser.createBodyTraverser(rootNode), testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(ContentTraverser.createSelectionTraverser(rootNode, range), testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(
            ContentTraverser.createBlockTraverser(rootNode, range, ContentPosition.End),
            testBlockElement
        );
    });
});

describe('ContentTraverser getNextBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, no nextBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement.equals(testBlockElement)).toBe(true);
        expect(contentTraverser.currentBlockElement).toBe(nextBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, PositionType.End);
        let range = createRange(start, end);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside startBlockElement, scoper is SelectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode);
        let contentTraverser = ContentTraverser.createBlockTraverser(
            rootNode,
            range,
            ContentPosition.Begin
        );

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, scoper = SelectionScoper, no previousBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);
        contentTraverser.getNextBlockElement();
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement.equals(testBlockElement)).toBe(true);
        expect(contentTraverser.currentBlockElement).toBe(previousBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement outside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.lastChild, PositionType.Begin);
        let end = new Position(rootNode.lastChild, PositionType.End);

        // range = '<p>part2</p>'
        let range = createRange(start, end);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });
});

describe('ContentTraverser currentInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        contentTraverser: ContentTraverser,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);

        // Act
        let inlineElement = contentTraverser.currentInlineElement;

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

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, start = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(
            ContentTraverser.createBlockTraverser(rootNode, range, ContentPosition.Begin),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, start = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(
            ContentTraverser.createBlockTraverser(rootNode, range, ContentPosition.End),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, start = ContentPosition.SelectionStart', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );

        // range = '<span>part2</span>'
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let node = document.createTextNode('part2');
        runTest(
            ContentTraverser.createBlockTraverser(rootNode, range, ContentPosition.SelectionStart),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(
            ContentTraverser.createSelectionTraverser(rootNode, range),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BodyScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let node = document.createTextNode('part1');
        runTest(ContentTraverser.createBodyTraverser(rootNode), PositionType.Begin, 5, node);
    });
});

describe('ContentTraverser getNextInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        contentTraverser: ContentTraverser,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                nextInlineElement,
                start,
                end,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(nextInlineElement);
    }

    it('input = <p>part1</p>, no nextInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, PositionType.End);

        // range = '<p>part1</p>'
        let range = createRange(start, end);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(
            ContentTraverser.createSelectionTraverser(rootNode, range),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, part nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.lastChild.firstChild, 2);

        // range = '<span>part1</span><span>pa'
        let range = createRange(start, end);
        let node = document.createTextNode('part2');
        runTest(
            ContentTraverser.createSelectionTraverser(rootNode, range),
            PositionType.Begin,
            2,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, nextInlineElement in startblock, scoper = selectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(
            ContentTraverser.createSelectionTraverser(rootNode, range),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in startblock, scoper = selectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = ContentTraverser.createBlockTraverser(
            rootNode,
            range,
            ContentPosition.Begin
        );

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        contentTraverser: ContentTraverser,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);
        contentTraverser.getNextInlineElement();

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                previousInlineElement,
                start,
                end,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(previousInlineElement);
    }

    it('input = <p>part1</p>, no previousInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.lastChild, PositionType.Begin);
        let end = new Position(rootNode.lastChild, PositionType.End);

        // range = '<p>part2</p>'
        let range = createRange(start, end);
        let contentTraverser = ContentTraverser.createSelectionTraverser(rootNode, range);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(
            ContentTraverser.createSelectionTraverser(rootNode, range),
            PositionType.Begin,
            5,
            node
        );
    });

    it('input = <span>part1</span><span>part2</span>, part previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let start = new Position(rootNode.firstChild.firstChild, 3);
        let end = new Position(rootNode.lastChild, PositionType.End);

        // range = 't1</span><span>part2</span>'
        let range = createRange(start, end);
        let node = document.createTextNode('part1');
        runTest(ContentTraverser.createSelectionTraverser(rootNode, range), 3, 5, node);
    });
});
