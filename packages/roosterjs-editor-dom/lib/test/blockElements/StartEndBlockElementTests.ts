import * as DomTestHelper from '../DomTestHelper';
import getNextPreviousInlineElement from '../../inlineElements/getNextPreviousInlineElement';
import Position from '../../selection/Position';
import StartEndBlockElement from '../../blockElements/StartEndBlockElement';
import { InlineElement } from 'roosterjs-editor-types';

let testID = 'StartEndBlockElement';

function createStartEndBlockElementWithContent(
    content: string
): [StartEndBlockElement, HTMLElement] {
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let startNode = testDiv.firstChild;
    let endNode = testDiv.lastChild;
    let startEndBlockElement = new StartEndBlockElement(testDiv, startNode, endNode);
    return [startEndBlockElement, testDiv];
}

function createLinkElementWithContent(content: string): Node {
    let node = document.createElement('a');
    node.innerHTML = content;
    return node;
}

describe('StartEndBlockElement getTextContent()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, output: string) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);

        // Act
        let textContent = blockElement.getTextContent();

        // Assert
        expect(textContent).toBe(output);
    }

    it('input = www.example.com', () => {
        runTest('www.example.com', 'www.example.com');
    });

    it('input = hello<a>www.example.com</a><br>', () => {
        runTest('hello<a>www.example.com</a><br>', 'hellowww.example.com');
    });
});

describe('StartEndBlockElement getStartNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, output: Node) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);

        // Act
        let startNode = blockElement.getStartNode();

        // Assert
        expect(startNode).toEqual(output);
    }

    it('input = www.example.com', () => {
        // In this case, startNode = endNode, both are text nodes.
        runTest('www.example.com', document.createTextNode('www.example.com'));
    });

    it('input = hello<a>www.example.com</a><br>', () => {
        runTest('hello<a>www.example.com</a><br>', document.createTextNode('hello'));
    });
});

describe('StartEndBlockElement getEndNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(input: string, output: Node) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);

        // Act
        let endNode = blockElement.getEndNode();

        // Assert
        expect(endNode).toEqual(output);
    }

    it('input = www.example.com', () => {
        runTest('www.example.com', document.createTextNode('www.example.com'));
    });

    it('input = hello<a>www.example.com</a><br>', () => {
        runTest('hello<a>www.example.com</a><br>', document.createElement('br'));
    });
});

describe('StartEndBlockElement getContentNodes()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = www.example.com', () => {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent('www.example.com');

        // Act
        let contents = blockElement.getContentNodes();

        // Assert
        expect(contents[0]).toEqual(document.createTextNode('www.example.com'));
    });

    it('input = hello<a>www.example.com</a><br>', () => {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(
            'hello<a>www.example.com</a><br>'
        );

        // Act
        let contents = blockElement.getContentNodes();

        // Assert
        expect(contents[0]).toEqual(document.createTextNode('hello'));
        expect(contents[1]).toEqual(createLinkElementWithContent('www.example.com'));
        expect(contents[2]).toEqual(document.createElement('br'));
    });
});

describe('StartEndBlockElement getInlineElements()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        inlineElement: InlineElement,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        let start = new Position(node, startOffset);
        let end = new Position(node, endOffset);
        expect(
            DomTestHelper.isInlineElementEqual(inlineElement, start, end, node.textContent)
        ).toBe(true);
    }

    it('input = <img>hello<a>www.example.com</a><br>', () => {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(
            '<img>hello<a>www.example.com</a><br>'
        );

        // Act
        let inlineElements = blockElement.getInlineElements();

        // Assert
        runTest(inlineElements[0], 0, 1, document.createElement('img'));
        runTest(inlineElements[1], 0, 5, document.createTextNode('hello'));
        runTest(inlineElements[2], 0, 15, document.createTextNode('www.example.com'));
        runTest(inlineElements[3], 0, 1, document.createElement('br'));
    });
});

describe('StartEndBlockElement equals()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('blockElement1 equals blockElement2', () => {
        // Arrange
        let [blockElement1, testDiv] = createStartEndBlockElementWithContent(
            '<img>hello<a>www.example.com</a><br>'
        );
        let blockElement2 = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            testDiv,
            testDiv.firstChild,
            testDiv.lastChild
        );

        // Act
        let isEqual = blockElement1.equals(blockElement2);

        // Assert
        expect(isEqual).toBe(true);
    });

    it('blockElement1 does not equal blockElement2, diff on startNode', () => {
        // Arrange
        let [blockElement1, testDiv] = createStartEndBlockElementWithContent(
            '<img>hello<a>www.example.com</a><br>'
        );
        let blockElement2 = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            testDiv,
            testDiv.firstChild.nextSibling,
            testDiv.lastChild
        );

        // Act
        let isEqual = blockElement1.equals(blockElement2);

        // Assert
        expect(isEqual).toBe(false);
    });

    it('blockElement1 does not equal blockElement2, diff on endNode', () => {
        // Arrange
        let [blockElement1, testDiv] = createStartEndBlockElementWithContent(
            '<img>hello<a>www.example.com</a><br>'
        );
        let blockElement2 = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            testDiv,
            testDiv.firstChild,
            testDiv.lastChild.previousSibling
        );

        // Act
        let isEqual = blockElement1.equals(blockElement2);

        // Assert
        expect(isEqual).toBe(false);
    });
});

describe('StartEndBlockElement isAfter()', () => {
    function runTest(
        rootNode1: HTMLElement,
        startNode1: Node,
        endNode1: Node,
        rootNode2: HTMLElement,
        startNode2: Node,
        endNode2: Node,
        output: [boolean, boolean]
    ) {
        // Arrange
        let blockElement1 = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode1,
            startNode1,
            endNode1
        );
        let blockElement2 = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode2,
            startNode2,
            endNode2
        );

        // Act
        let isElement2AfterElement1 = blockElement2.isAfter(blockElement1);
        let isElement1AfterElement2 = blockElement1.isAfter(blockElement2);

        // Assert
        expect(isElement2AfterElement1).toBe(output[0]);
        expect(isElement1AfterElement2).toBe(output[1]);
    }

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = hello<br>world, startNode of blockElement2 is after endNode of blockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(testID, 'hello<br>world');
        runTest(
            testDiv,
            testDiv.firstChild,
            testDiv.firstChild.nextSibling,
            testDiv,
            testDiv.lastChild,
            testDiv.lastChild,
            [true, false]
        );
    });

    it('input = hello<br>world, startNode of blockElement2 is equal to endNode of blockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(testID, 'hello<br>world');
        runTest(
            testDiv,
            testDiv.firstChild,
            testDiv.firstChild.nextSibling,
            testDiv,
            testDiv.firstChild.nextSibling,
            testDiv.lastChild,
            [false, false]
        );
    });

    it('input = hello<br>world, startNode of blockElement2 is before endNode of blockElement1', () => {
        let testDiv = DomTestHelper.createElementFromContent(testID, 'hello<br>world');
        runTest(
            testDiv,
            testDiv.firstChild,
            testDiv.firstChild.nextSibling,
            testDiv,
            testDiv.firstChild,
            testDiv.lastChild,
            [false, false]
        );
    });
});

describe('StartEndBlockElement isInBlock()', () => {
    function getInlineElementAfterBlockElement(
        rootNode: HTMLElement,
        blockElement: StartEndBlockElement
    ): InlineElement {
        let inlineElementAfterBlockElement = getNextPreviousInlineElement(
            rootNode,
            blockElement.getLastInlineElement(),
            true
        );
        return inlineElementAfterBlockElement;
    }

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <img><span>part1</span><a>part2</a>', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<img>hello<a>www.example.com</a><br>world'
        );
        let blockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            testDiv,
            testDiv.firstChild,
            testDiv.lastChild.previousSibling
        );
        let inlineElements = blockElement.getInlineElements();
        let inlineElementAfterBlockElement = getInlineElementAfterBlockElement(
            testDiv,
            blockElement
        );

        // Act
        let isElement1InBlock = blockElement.isInBlock(inlineElements[0]);
        let isElement2InBlock = blockElement.isInBlock(inlineElements[1]);
        let isElement3InBlock = blockElement.isInBlock(inlineElements[2]);
        let isElement4InBlock = blockElement.isInBlock(inlineElements[3]);
        let isElement5InBlock = blockElement.isInBlock(inlineElementAfterBlockElement);

        // Assert
        expect(isElement1InBlock).toEqual(true);
        expect(isElement2InBlock).toEqual(true);
        expect(isElement3InBlock).toEqual(true);
        expect(isElement4InBlock).toEqual(true);
        expect(isElement5InBlock).toEqual(false);
    });
});

describe('StartEndBlockElement contains()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('nodeBlockElement contains node', () => {
        // Arrange
        let [blockElement, testDiv] = createStartEndBlockElementWithContent(
            '<img>hello<a>www.example.com</a><br>'
        );
        let node = testDiv.firstChild;

        // Act
        let blockElementContainsNode = blockElement.contains(node);

        // Assert
        expect(blockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement.node equals node', () => {
        // Arrange
        let [blockElement, testDiv] = createStartEndBlockElementWithContent('www.example.com');
        let node = testDiv.firstChild;

        // Act
        let blockElementContainsNode = blockElement.contains(node);

        // Assert
        expect(blockElementContainsNode).toBe(true);
    });

    it('nodeBlockElement does not contain node', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<img>hello<a>www.example.com</a><br>world'
        );
        let blockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            testDiv,
            testDiv.firstChild,
            testDiv.lastChild.previousSibling
        );
        let node = testDiv.lastChild;

        // Act
        let blockElementContainsNode = blockElement.contains(node);

        // Assert
        expect(blockElementContainsNode).toBe(false);
    });
});
