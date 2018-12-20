import * as DomTestHelper from '../DomTestHelper';
import createRange from '../../selection/createRange';
import Position from '../../selection/Position';
import SelectionScoper from '../../contentTraverser/SelectionScoper';
import { BlockElement, PositionType } from 'roosterjs-editor-types';

let testID = 'SelectionScoper';

function createSelectionScoper(rootNode: Node, selectionRange: Range) {
    return new SelectionScoper(rootNode, selectionRange);
}

describe('SelectionScoper getStartBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, range: Range, testBlockElement: BlockElement) {
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
        let start = new Position(rootNode.firstChild.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild.firstChild, PositionType.End);

        // range is 'e'
        let range = createRange(start, end);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper has multiple blockElements', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.lastChild, PositionType.End);

        let range = createRange(start, end);
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
        range: Range,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let scoper = createSelectionScoper(rootNode, range);
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

    it('input = www.example.com<br>, startInlineElment is TextInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<br>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, PositionType.Begin, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, PositionType.Begin, 5, node);
    });

    it('input = <img>www.example.com, startInlineElment is ImageInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<img>www.example.com');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createElement('img');
        runTest(rootNode, range, PositionType.Begin, PositionType.End, node);
    });

    it('input = www.example.com, startInlineElment is PartialInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com');
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, 3);

        // range is 'www'
        let range = createRange(start, end);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, PositionType.Begin, 3, node);
    });
});

describe('SelectionScoper isBlockInScope()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: Range,
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
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.lastChild, PositionType.End);
        let range = createRange(start, end);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, testBlockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, PositionType.End);
        let range = createRange(start, end);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, false);
    });

    it('input = <p>part1</p><p>part2</p>, part of testBlockElement is in scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild.firstChild, 2);
        let end = new Position(rootNode.lastChild.firstChild, 3);

        // range = 'rt1</p><p>par'
        let range = createRange(start, end);

        // First block element
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, part of blockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let start = new Position(rootNode.firstChild.firstChild, 2);
        let end = new Position(rootNode.lastChild.firstChild, 3);

        // range = 'rt1</p><p>par'
        let range = createRange(start, end);

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
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, PositionType.End);

        // range is '<p>part1</p>'
        let range = createRange(start, end);
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
        let start = new Position(rootNode.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild, PositionType.End);

        // range is '<p>part1</p>'
        let range = createRange(start, end);
        let scoper = createSelectionScoper(rootNode, range);

        // inlineElement is 'part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.lastChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBeFalsy();
    });

    it('input = <span>part1,part2</span>, part of inlineElement is out of scope', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<span>part1,part2</span>');
        let start = new Position(rootNode.firstChild.firstChild, PositionType.Begin);
        let end = new Position(rootNode.firstChild.firstChild, 5);

        // range is 'part1'
        let range = createRange(start, end);
        let scoper = createSelectionScoper(rootNode, range);

        // inlineElement is 'part1,part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        start = new Position(rootNode.firstChild.firstChild, PositionType.Begin);
        end = new Position(rootNode.firstChild.firstChild, 5);
        expect(DomTestHelper.isInlineElementEqual(trimmedElement, start, end, 'part1')).toBe(true);
    });
});
