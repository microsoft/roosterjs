import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import SelectionScoper from '../../scopers/SelectionScoper';
import { BlockElement, PositionType } from 'roosterjs-editor-types';
import Position from '../../selection/Position';
import SelectionRangeBase from '../../selection/SelectionRangeBase';

let testID = 'SelectionScoper';

function createSelectionScoper(rootNode: Node, selectionRange: SelectionRangeBase) {
    let inlineElementFactory = new InlineElementFactory(null);
    return new SelectionScoper(rootNode, selectionRange, inlineElementFactory);
}

describe('SelectionScoper getStartBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, range: SelectionRangeBase, testBlockElement: BlockElement) {
        // Arrange
        let scoper = createSelectionScoper(rootNode, range);

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
        let startPosition = new Position(rootNode.firstChild.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild.firstChild, Position.End);

        // range is 'e'
        let range = new SelectionRangeBase(startPosition, endPosition);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper has multiple blockElements', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.lastChild, Position.End);

        let range = new SelectionRangeBase(startPosition, endPosition);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });
});

describe('SelectionScoper getStartInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: SelectionRangeBase,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let scoper = createSelectionScoper(rootNode, range);
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElement = scoper.getStartInlineElement();

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

    it('input = www.example.com<br>, startInlineElment is TextInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<br>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, 0, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, 0, 5, node);
    });

    it('input = <img>www.example.com, startInlineElment is ImageInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<img>www.example.com');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = rootNode.firstChild;
        runTest(rootNode, range, 0, Position.End, node);
    });

    it('input = www.example.com, startInlineElment is PartialInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, 3);

        // range is 'www'
        let range = new SelectionRangeBase(startPosition, endPosition);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, 0, 3, node);
    });
});

describe('SelectionScoper isBlockInScope()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: SelectionRangeBase,
        testBlockElement: BlockElement,
        output: boolean
    ) {
        // Arrange
        let scoper = createSelectionScoper(rootNode, range);

        // Act
        let isTestBlockInScope = scoper.isBlockInScope(testBlockElement);

        // Assert
        expect(isTestBlockInScope).toBe(output);
    }

    it('input = <p>part1</p><p>part2</p>, testBlockElement is in scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.lastChild, Position.End);
        let range = new SelectionRangeBase(startPosition, endPosition);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, testBlockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, Position.End);
        let range = new SelectionRangeBase(startPosition, endPosition);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, false);
    });

    it('input = <p>part1</p><p>part2</p>, part of testBlockElement is in scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild.firstChild, 2);
        let endPosition = new Position(rootNode.lastChild.firstChild, 3);

        // range = 'rt1</p><p>par'
        let range = new SelectionRangeBase(startPosition, endPosition);

        // First block element
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, part of blockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild.firstChild, 2);
        let endPosition = new Position(rootNode.lastChild.firstChild, 3);

        // range = 'rt1</p><p>par'
        let range = new SelectionRangeBase(startPosition, endPosition);

        // Second block element
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });
});

describe('SelectionScoper trimInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p><p>part2</p>, inlineElement inside scope', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, Position.End);

        // range is '<p>part1</p>'
        let range = new SelectionRangeBase(startPosition, endPosition);
        let scoper = createSelectionScoper(rootNode, range);

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

    it('input = <p>part1</p><p>part2</p>, inlineElement complete out of scope', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPosition = new Position(rootNode.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild, Position.End);

        // range is '<p>part1</p>'
        let range = new SelectionRangeBase(startPosition, endPosition);
        let scoper = createSelectionScoper(rootNode, range);

        // inlineElement is 'part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.lastChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBeUndefined();
    });

    it('input = <span>part1,part2</span>, part of inlineElement is out of scope', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<span>part1,part2</span>');
        let startPosition = new Position(rootNode.firstChild.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild.firstChild, 5);

        // range is 'part1'
        let range = new SelectionRangeBase(startPosition, endPosition);
        let scoper = createSelectionScoper(rootNode, range);

        // inlineElement is 'part1,part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        startPosition = new Position(rootNode.firstChild.firstChild, 0);
        endPosition = new Position(rootNode.firstChild.firstChild, 5);
        expect(
            DomTestHelper.isInlineElementEqual(trimmedElement, startPosition, endPosition, 'part1')
        ).toBe(true);
    });
});
