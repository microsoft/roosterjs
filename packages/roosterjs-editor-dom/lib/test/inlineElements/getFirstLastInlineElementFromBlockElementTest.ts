import * as DomTestHelper from '../DomTestHelper';
import getFirstLastInlineElementFromBlockElement from '../../inlineElements/getFirstLastInlineElementFromBlockElement';
import NodeBlockElement from '../../blockElements/NodeBlockElement';
import Position from '../../selection/Position';
import StartEndBlockElement from '../../blockElements/StartEndBlockElement';

let testID = 'getFirstLastInlineElementFromBlockElement';

function createNodeBlockElementWithContent(content: string): [NodeBlockElement, HTMLElement] {
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let nodeBlockElement = new NodeBlockElement(testDiv);
    return [nodeBlockElement, testDiv];
}

function createStartEndBlockElementWithContent(
    content: string
): [StartEndBlockElement, HTMLElement] {
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let startNode = testDiv.firstChild;
    let endNode = testDiv.lastChild;
    let startEndBlockElement = new StartEndBlockElement(testDiv, startNode, endNode);
    return [startEndBlockElement, testDiv];
}

describe('NodeBlockElement getFirstInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [nodeBlockElement] = createNodeBlockElementWithContent(input);
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElement = getFirstLastInlineElementFromBlockElement(nodeBlockElement, true);

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
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElement = getFirstLastInlineElementFromBlockElement(nodeBlockElement, false);

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

describe('StartEndBlockElement getFirstInlineElement()', () => {
    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);

        // Act
        let inlineElement = getFirstLastInlineElementFromBlockElement(blockElement, true);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(inlineElement, start, end, node.textContent)
        ).toBe(true);
    }

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = www.example.com', () => {
        let node = document.createTextNode('www.example.com');
        runTest('www.example.com', 0, 15, node);
    });

    it('input = <a>www.example.com</a><br>', () => {
        let node = document.createTextNode('www.example.com');
        runTest('<a>www.example.com</a><br>', 0, 15, node);
    });

    it('input = <img>www.example.com', () => {
        let node = document.createElement('img');
        runTest('<img>www.example.com', 0, 1, node);
    });
});

describe('StartEndBlockElement getLastInlineElement()', () => {
    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);

        // Act
        let inlineElement = getFirstLastInlineElementFromBlockElement(blockElement, false);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(inlineElement, start, end, node.textContent)
        ).toBe(true);
    }

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = www.example.com', () => {
        let node = document.createTextNode('www.example.com');
        runTest('www.example.com', 0, 15, node);
    });

    it('input = <a>www.example.com</a><br>', () => {
        let node = document.createElement('br');
        runTest('<a>www.example.com</a><br>', 0, 1, node);
    });

    it('input = <img>www.example.com', () => {
        let node = document.createTextNode('www.example.com');
        runTest('<img>www.example.com', 0, 15, node);
    });
});
