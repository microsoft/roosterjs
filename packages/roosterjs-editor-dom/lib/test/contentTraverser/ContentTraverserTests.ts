import * as DomTestHelper from '../DomTestHelper';
import ContentTraverser from '../../contentTraverser/ContentTraverser';
import { ContentPosition, ContentScope } from 'roosterjs-editor-types';
import Position from '../../selection/Position';
import SelectionRange from '../../selection/SelectionRange';
import PositionType from '../../selection/PositionType';
import BlockElement from '../../blockElements/BlockElement';

let testID = 'ContentTraverser';

describe('ContentTraverser currentBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: SelectionRange,
        scope: ContentScope,
        position: ContentPosition,
        testBlockElement: BlockElement
    ) {
        // Arrange
        let contentTraverser = new ContentTraverser(rootNode, scope, range, position);

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
        runTest(rootNode, null, ContentScope.Body, null, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, ContentScope.Selection, null, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = BlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, ContentScope.Block, null, testBlockElement);
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
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);
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
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, Position.End);
        let range = new SelectionRange(startPosition, endPosition);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside startBlockElement, scoper is BlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode);
        let contentTraverser = new ContentTraverser(
            rootNode,
            ContentScope.Block,
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
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);
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
        let startPosition = new Position(rootNode.lastChild, 0);
        let endPosition = new Position(rootNode.lastChild, Position.End);

        // range = '<p>part2</p>'
        let range = new SelectionRange(startPosition, endPosition);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

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
        rootNode: Node,
        range: SelectionRange,
        scope: ContentScope,
        position: ContentPosition,
        startOffset: number | PositionType,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scope, range, position);

        // Act
        let inlineElement = contentTraverser.currentInlineElement;

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <span>part1</span><span>part2</span>, scoper = BlockScoper, startPosition = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentScope.Block, ContentPosition.Begin, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BlockScoper, startPosition = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentScope.Block, ContentPosition.End, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BlockScoper, startPosition = ContentPosition.SelectionStart', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );

        // range = '<span>part2</span>'
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentScope.Block, ContentPosition.SelectionStart, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentScope.Selection, null, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BodyScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let node = document.createTextNode('part1');
        runTest(rootNode, null, ContentScope.Body, null, 0, 5, node);
    });
});

describe('ContentTraverser getNextInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: SelectionRange,
        scope: ContentScope,
        position: ContentPosition,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scope, range, position);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                nextInlineElement,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(nextInlineElement);
    }

    it('input = <p>part1</p>, no nextInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, Position.End);

        // range = '<p>part1</p>'
        let range = new SelectionRange(startPosition, endPosition);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentScope.Selection, null, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.lastChild.firstChild, 2);

        // range = '<span>part1</span><span>pa'
        let range = new SelectionRange(startPosition, endPosition);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentScope.Selection, null, 0, 2, node);
    });

    it('input = <span>part1</span><span>part2</span>, nextInlineElement in startblock, scoper = BlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentScope.Selection, null, 0, 5, node);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in startblock, scoper = BlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let contentTraverser = new ContentTraverser(
            rootNode,
            ContentScope.Block,
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
        rootNode: Node,
        range: SelectionRange,
        scope: ContentScope,
        position: ContentPosition,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scope, range, position);
        contentTraverser.getNextInlineElement();

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                previousInlineElement,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
        expect(contentTraverser.currentInlineElement).toBe(previousInlineElement);
    }

    it('input = <p>part1</p>, no previousInlineElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.lastChild, 0);
        let endPosition = new Position(rootNode.lastChild, Position.End);

        // range = '<p>part2</p>'
        let range = new SelectionRange(startPosition, endPosition);
        let contentTraverser = new ContentTraverser(rootNode, ContentScope.Selection, range, null);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentScope.Selection, null, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPosition = new Position(rootNode.firstChild.firstChild, 3);
        let endPosition = new Position(rootNode.lastChild, Position.End);

        // range = 't1</span><span>part2</span>'
        let range = new SelectionRange(startPosition, endPosition);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentScope.Selection, null, 3, 5, node);
    });
});
