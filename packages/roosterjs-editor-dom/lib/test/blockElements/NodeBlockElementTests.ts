import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import { NodeBlockElement } from '../../blockElements/BlockElement';
import { InlineElement, Position } from 'roosterjs-editor-types';

let testID = 'NodeBlockElement';

function createNodeBlockElementWithContent(content: string): [NodeBlockElement, HTMLElement] {
    let inlineElementFactory = new InlineElementFactory(null);
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let nodeBlockElement = new NodeBlockElement(testDiv, inlineElementFactory);
    return [nodeBlockElement, testDiv];
}

describe('NodeBlockElement getTextContent()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, output: string) {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(input);

        // Act
        let textContent = nodeBlockElement.getTextContent();

        // Assert
        expect(textContent).toBe(output);
    }

    it('input = <span>www.example.com</span>', () => {
        runTest('<span>www.example.com</span>', 'www.example.com');
    });

    it('input = <p>hello world</p><span>www.example.com</span>', () => {
        runTest('<p>hello world</p><span>www.example.com</span>', 'hello worldwww.example.com');
    });

    it('input = <a>link</a><span>www.example.com</span>', () => {
        runTest('<a>link</a><span>www.example.com</span>', 'linkwww.example.com');
    });

    it('input = <img>', () => {
        runTest('<img>', '');
    });
});

describe('NodeBlockElement getStartNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>www.example.com</span>'
        );

        // Act
        let startNode = nodeBlockElement.getStartNode();

        // Assert
        expect(startNode).toBe(testDiv);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>part1</span><span>part2</span>'
        );

        // Act
        let startNode = nodeBlockElement.getStartNode();

        // Assert
        expect(startNode).toBe(testDiv);
    });
});

describe('NodeBlockElement getEndNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>www.example.com</span>'
        );

        // Act
        let endNode = nodeBlockElement.getEndNode();

        // Assert
        expect(endNode).toBe(testDiv);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>part1</span><span>part2</span>'
        );

        // Act
        let endNode = nodeBlockElement.getEndNode();

        // Assert
        expect(endNode).toBe(testDiv);
    });
});

describe('NodeBlockElement getContentNodes()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>www.example.com</span>'
        );

        // Act
        let contents = nodeBlockElement.getContentNodes();

        // Assert
        expect(contents).toEqual([testDiv]);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<span>part1</span><span>part2</span>'
        );

        // Act
        let contents = nodeBlockElement.getContentNodes();

        // Assert
        expect(contents).toEqual([testDiv]);
    });
});

describe('NodeBlockElement getFirstInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(input);
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);

        // Act
        let inlineElement = nodeBlockElement.getFirstInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                node.textContent
            )
        ).toBe(true);
    }

    it('input = <span>www.example.com</span>', () => {
        let node = document.createTextNode('www.example.com');
        runTest('www.example.com', 0, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        let node = document.createTextNode('part1');
        runTest('<span>part1</span><span>part2</span>', 0, 5, node);
    });

    it('input = <span>part1<span>part2</span></span>', () => {
        let node = document.createTextNode('part1');
        runTest('<span>part1<span>part2</span></span>', 0, 5, node);
    });

    it('input = <span><img>part2</span>', () => {
        let node = document.createElement('img');
        runTest('<span><img>part2</span>', 0, 1, node);
    });
});

describe('NodeBlockElement getLastInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(input);
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);

        // Act
        let inlineElement = nodeBlockElement.getLastInlineElement();

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                node.textContent
            )
        ).toBe(true);
    }

    it('input = <span>www.example.com</span>', () => {
        let node = document.createTextNode('www.example.com');
        runTest('www.example.com', 0, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>', () => {
        let node = document.createTextNode('part2');
        runTest('<span>part1</span><span>part2</span>', 0, 5, node);
    });

    it('input = <span>part1<span>part2</span></span>', () => {
        let node = document.createTextNode('part2');
        runTest('<span>part1<span>part2</span></span>', 0, 5, node);
    });

    it('input = <span>part2<img></span>', () => {
        let node = document.createElement('img');
        runTest('<span>part2<img></span>', 0, 1, node);
    });
});

describe('NodeBlockElement getInlineElements()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        inlineElement: InlineElement,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                node.textContent
            )
        ).toBe(true);
    }

    it('input = <img><span>part1</span><a>part2</a>', () => {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(
            '<img><span>part1</span><a>part2</a>'
        );

        // Act
        let inlineElements = nodeBlockElement.getInlineElements();

        // Assert
        runTest(inlineElements[0], 0, 1, document.createElement('img'));
        runTest(inlineElements[1], 0, 5, document.createTextNode('part1'));
        runTest(inlineElements[2], 0, 5, document.createTextNode('part2'));
    });
});

describe('NodeBlockElement equals()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('nodeBlockElement1 equals nodeBlockElement2', () => {
        // Arrange
        let [nodeBlockElement1, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(testDiv);

        // Act
        let isEqual = nodeBlockElement1.equals(nodeBlockElement2);

        // Assert
        expect(isEqual).toBe(true);
    });

    it('nodeBlockElement1 does not equal nodeBlockElement2', () => {
        // Arrange
        let [nodeBlockElement1, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(
            testDiv.firstChild as HTMLElement
        );

        // Act
        let isEqual = nodeBlockElement1.equals(nodeBlockElement2);

        // Assert
        expect(isEqual).toBe(false);
    });
});

describe('NodeBlockElement isAfter()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: [Node, Node], output: [boolean, boolean]) {
        // Arrange
        let nodeBlockElement1 = DomTestHelper.createNodeBlockElementWithDiv(
            input[0] as HTMLElement
        );
        let nodeBlockElement2 = DomTestHelper.createNodeBlockElementWithDiv(
            input[1] as HTMLElement
        );

        // Act
        let isElement2AfterElement1 = nodeBlockElement2.isAfter(nodeBlockElement1);
        let isElement1AfterElement2 = nodeBlockElement1.isAfter(nodeBlockElement2);

        // Assert
        expect(isElement2AfterElement1).toBe(output[0]);
        expect(isElement1AfterElement2).toBe(output[1]);
    }

    it('input = <div>part1</div><div>part2</div>, nodeBlockElement2 is after nodeBlockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1</div><div>part2</div>'
        );
        runTest([testDiv.firstChild, testDiv.lastChild], [true, false]);
    });

    it('input = <div>part1<div>part2</div></div>, nodeBlockElement2 is after nodeBlockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1<div>part2</div></div>'
        );
        runTest([testDiv.firstChild.firstChild, testDiv.firstChild.lastChild], [true, false]);
    });

    it('input = <div>www.example.com</div>, nodeBlockElement1 equals to nodeBlockElement2', () => {
        let testDiv = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest([testDiv, testDiv], [false, false]);
    });
});

describe('NodeBlockElement isInBlock()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function createNodeInlineElement(inlineElementContent: string): InlineElement {
        let inlineElementFactory = new InlineElementFactory(null);
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);
        let inlineElement = inlineElementFactory.resolve(testDiv.firstChild, testDiv, parentBlock);
        return inlineElement;
    }

    it('input = <img><span>part1</span><a>part2</a>', () => {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(
            '<img><span>part1</span><a>part2</a>'
        );
        let inlineElements = nodeBlockElement.getInlineElements();
        let myInlineElement = createNodeInlineElement('<span>www.example.com</span>');

        // Act
        let isElement1InBlock = nodeBlockElement.isInBlock(inlineElements[0]);
        let isElement2InBlock = nodeBlockElement.isInBlock(inlineElements[1]);
        let isElement3InBlock = nodeBlockElement.isInBlock(inlineElements[2]);
        let isElement4InBlock = nodeBlockElement.isInBlock(myInlineElement);

        // Assert
        expect(isElement1InBlock).toEqual(true);
        expect(isElement2InBlock).toEqual(true);
        expect(isElement3InBlock).toEqual(true);
        expect(isElement4InBlock).toEqual(false);
    });
});

describe('NodeBlockElement contains()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('nodeBlockElement contains node', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let containedNode = testDiv.firstChild;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement.containerNode equals node', () => {
        // Arrange
        let [nodeBlockElement, testDiv] = createNodeBlockElementWithContent(
            '<div>part1</div><div>part2</div>'
        );
        let containedNode = testDiv;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement does not contain node', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<div>part1</div><div>part2</div>'
        );
        let nodeBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            testDiv.firstChild as HTMLElement
        );
        let containedNode = testDiv.lastChild;

        // Act
        let nodeBlockElementContainsNode = nodeBlockElement.contains(containedNode);

        // Assert
        expect(nodeBlockElementContainsNode).toBe(false);
    });
});
