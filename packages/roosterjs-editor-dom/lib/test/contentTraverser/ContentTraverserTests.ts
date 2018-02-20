import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import ContentTraverser from '../../contentTraverser/ContentTraverser';
import BodyScoper from '../../scopers/BodyScoper';
import SelectionScoper from '../../scopers/SelectionScoper';
import SelectionBlockScoper from '../../scopers/SelectionBlockScoper';
import {
    ContentPosition,
    TraversingScoper,
    BlockElement,
    Position,
    SelectionRangeBase,
    PositionType,
} from 'roosterjs-editor-types';

let testID = 'ContentTraverser';
let inlineElementFactory: InlineElementFactory;

describe('ContentTraverser currentBlockElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, scoper: TraversingScoper, testBlockElement: BlockElement) {
        // Arrange
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let currentBlockElement = contentTraverser.currentBlockElement;

        // Assert
        expect(currentBlockElement.equals(testBlockElement)).toBe(true);
    }

    it('input = <p>part1</p><p>part2</p>, scoper = BodyScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let scoper = new BodyScoper(rootNode, inlineElementFactory);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.End,
            inlineElementFactory
        );
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, scoper, testBlockElement);
    });
});

describe('ContentTraverser getNextBlockElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, no nextBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);
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
        let startPosition = Position.create(rootNode.firstChild, 0);
        let endPosition = Position.create(rootNode.firstChild, Position.End);
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextBlockElement outside startBlockElement, scoper is SelectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.Begin,
            inlineElementFactory
        );
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextBlockElement = contentTraverser.getNextBlockElement();

        // Assert
        expect(nextBlockElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousBlockElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p>, scoper = SelectionScoper, no previousBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p>');
        let range = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, scoper = SelectionScoper, previousBlockElement inside scoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);
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
        let startPosition = Position.create(rootNode.lastChild, 0);
        let endPosition = Position.create(rootNode.lastChild, Position.End);

        // range = '<p>part2</p>'
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let previousBlockElement = contentTraverser.getPreviousBlockElement();

        // Assert
        expect(previousBlockElement).toBe(null);
    });
});

describe('ContentTraverser currentInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number | PositionType,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

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

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.Begin,
            inlineElementFactory
        );
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.End,
            inlineElementFactory
        );
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionBlockScoper, startPosition = ContentPosition.SelectionStart', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );

        // range = '<span>part2</span>'
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.SelectionStart,
            inlineElementFactory
        );
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = SelectionScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, scoper = BodyScoper, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let scoper = new BodyScoper(rootNode, inlineElementFactory);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });
});

describe('ContentTraverser getNextInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

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
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = Position.create(rootNode.firstChild, 0);
        let endPosition = Position.create(rootNode.firstChild, Position.End);

        // range = '<p>part1</p>'
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part nextInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPosition = Position.create(rootNode.firstChild, 0);
        let endPosition = Position.create(rootNode.lastChild.firstChild, 2);

        // range = '<span>part1</span><span>pa'
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 2, node);
    });

    it('input = <span>part1</span><span>part2</span>, nextInlineElement in startblock, scoper = selectionBlockScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part2');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <p>part1</p><p>part2</p>, nextInlineElement not in startblock, scoper = selectionBlockScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionBlockScoper(
            rootNode,
            range,
            ContentPosition.Begin,
            inlineElementFactory
        );
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let nextInlineElement = contentTraverser.getNextInlineElement();

        // Assert
        expect(nextInlineElement).toBe(null);
    });
});

describe('ContentTraverser getPreviousInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        scoper: TraversingScoper,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);
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
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement not in scope, scoper = selectionScoper', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = Position.create(rootNode.lastChild, 0);
        let endPosition = Position.create(rootNode.lastChild, Position.End);

        // range = '<p>part2</p>'
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let contentTraverser = new ContentTraverser(rootNode, scoper, inlineElementFactory);

        // Act
        let previousInlineElement = contentTraverser.getPreviousInlineElement();

        // Assert
        expect(previousInlineElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, part previousInlineElement in scope, scoper = selectionScoper', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPosition = Position.create(rootNode.firstChild.firstChild, 3);
        let endPosition = Position.create(rootNode.lastChild, Position.End);

        // range = 't1</span><span>part2</span>'
        let range = SelectionRangeBase.create(startPosition, endPosition);
        let scoper = new SelectionScoper(rootNode, range, inlineElementFactory);
        let node = document.createTextNode('part1');
        runTest(rootNode, scoper, 3, 5, node);
    });
});
