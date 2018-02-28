import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../objectModel/InlineElementFactory';
import SelectionBlockScoper from '../../scopers/SelectionBlockScoper';
import { ContentPosition } from 'roosterjs-editor-types';
import Position from '../../selection/Position';
import SelectionRange from '../../selection/SelectionRange';
import { BlockElement } from '../../objectModel/types';
import PositionType from '../../selection/PositionType';

let testID = 'SelectionBlockScoper';

function createSelectionBlockScoper(
    rootNode: Node,
    selectionRange: SelectionRange,
    startPosition: ContentPosition
) {
    let inlineElementFactory = new InlineElementFactory();
    return new SelectionBlockScoper(rootNode, selectionRange, startPosition, inlineElementFactory);
}

describe('SelectionBlockScoper getStartBlockElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, range: SelectionRange, testBlockElement: BlockElement) {
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
        let startPosition = new Position(rootNode.firstChild.firstChild, 0);
        let endPosition = new Position(rootNode.firstChild.firstChild, 1);

        // range is 'e'
        let range = new SelectionRange(startPosition, endPosition);
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
        range: SelectionRange,
        startContentPosition: ContentPosition,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let scoper = createSelectionBlockScoper(rootNode, range, startContentPosition);
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

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.Begin', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentPosition.Begin, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.End', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentPosition.End, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.SelectionStart, select whole inlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let node = document.createTextNode('part2');
        runTest(rootNode, range, ContentPosition.SelectionStart, 0, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, startPosition = ContentPosition.SelectionStart, select partial inlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPosition = new Position(rootNode.firstChild.firstChild, 3);
        let endPosition = new Position(rootNode.lastChild.firstChild, Position.End);

        // range = 't1</span><span>part2</span>'
        let range = new SelectionRange(startPosition, endPosition);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, ContentPosition.SelectionStart, 3, 5, node);
    });
});

describe('SelectionBlockScoper getInlineElementBeforeStart()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <p>part1</p><p>part2</p>, startPosition = ContentPosition.Begin', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.Begin);

        // Act
        let inlineBeforeStart = scoper.getInlineElementBeforeStart();

        // Assert
        expect(inlineBeforeStart).toBeUndefined();
    });

    it('input = <p>part1</p><p>part2</p>, startPosition = ContentPosition.End', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.End);

        // Act
        let inlineBeforeStart = scoper.getInlineElementBeforeStart();

        // Assert
        expect(inlineBeforeStart).toBeUndefined();
    });

    it('input = <p>part1</p><p>hello</p>, startPosition = ContentPosition.SelectiionStart, inlineBeforeStart inside startBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>hello</p>');

        // range is 'o</p>'
        let range = new SelectionRange(
            new Position(rootNode.lastChild.firstChild, 4),
            new Position(rootNode.lastChild.firstChild, 5)
        );
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);
        let startPosition = new Position(rootNode.lastChild.firstChild, 0);
        let endPosition = new Position(rootNode.lastChild.firstChild, 4);
        let node = document.createTextNode('hello');

        // Act
        let inlineBeforeStart = scoper.getInlineElementBeforeStart();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineBeforeStart,
                startPosition,
                endPosition,
                node.textContent.substr(0, 4)
            )
        ).toBe(true);
    });

    it('input = <p>part1</p><p>part2</p>, startPosition = ContentPosition.SelectiionStart, inlineBeforeStart outside startBlockElement', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>hello</p>');

        // range is '<p>hello</p>'
        let range = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let scoper = createSelectionBlockScoper(rootNode, range, ContentPosition.SelectionStart);

        // Act
        let inlineBeforeStart = scoper.getInlineElementBeforeStart();

        // Assert
        expect(inlineBeforeStart).toBe(null);
    });
});

describe('SelectionBlockScoper isBlockInScope()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        range: SelectionRange,
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
