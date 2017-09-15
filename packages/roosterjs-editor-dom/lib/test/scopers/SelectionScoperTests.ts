import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import SelectionScoper from '../../scopers/SelectionScoper';
import { BlockElement, NodeBoundary } from 'roosterjs-editor-types';

let testID = 'SelectionScoper';

function createSelectionScoper(rootNode: Node, selectionRange: Range) {
    let inlineElementFactory = new InlineElementFactory(null);
    return new SelectionScoper(rootNode, selectionRange, inlineElementFactory);
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
        let startPoint = {
            containerNode: rootNode.firstChild.firstChild,
            offset: NodeBoundary.Begin,
        };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: NodeBoundary.End };

        // range is 'e'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement);
    });

    it('input = <p>part1</p><p>part2</p>, scoper has multiple blockElements', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.End };

        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
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
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };

        // Act
        let inlineElement = scoper.getStartInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = www.example.com<br>, startInlineElment is TextInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<br>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, NodeBoundary.Begin, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>, startInlineElment is part1', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part1');
        runTest(rootNode, range, NodeBoundary.Begin, 5, node);
    });

    it('input = <img>www.example.com, startInlineElment is ImageInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<img>www.example.com');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createElement('img');
        runTest(rootNode, range, NodeBoundary.Begin, NodeBoundary.End, node);
    });

    it('input = www.example.com, startInlineElment is PartialInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com');
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: 3 };

        // range is 'www'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, range, NodeBoundary.Begin, 3, node);
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
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.End };
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, testBlockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, false);
    });

    it('input = <p>part1</p><p>part2</p>, part of testBlockElement is in scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild.firstChild, offset: 2 };
        let endPoint = { containerNode: rootNode.lastChild.firstChild, offset: 3 };

        // range = 'rt1</p><p>par'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);

        // First block element
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, range, testBlockElement, true);
    });

    it('input = <p>part1</p><p>part2</p>, part of blockElement is out of scope', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild.firstChild, offset: 2 };
        let endPoint = { containerNode: rootNode.lastChild.firstChild, offset: 3 };

        // range = 'rt1</p><p>par'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);

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
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };

        // range is '<p>part1</p>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
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
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };

        // range is '<p>part1</p>'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
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
        let startPoint = {
            containerNode: rootNode.firstChild.firstChild,
            offset: NodeBoundary.Begin,
        };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 5 };

        // range is 'part1'
        let range = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let scoper = createSelectionScoper(rootNode, range);

        // inlineElement is 'part1,part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = scoper.trimInlineElement(inlineElement);

        // Assert
        startPoint = { containerNode: rootNode.firstChild.firstChild, offset: NodeBoundary.Begin };
        endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 5 };
        expect(
            DomTestHelper.isInlineElementEqual(trimmedElement, startPoint, endPoint, 'part1')
        ).toBe(true);
    });
});
