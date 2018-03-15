import * as DomTestHelper from '../DomTestHelper';
import StartEndBlockElement from '../../blockElements/StartEndBlockElement';
import Position from '../../selection/Position';

let testID = 'StartEndBlockElement';

function createStartEndBlockElementWithContent(
    content: string
): [StartEndBlockElement, HTMLElement] {
    let testDiv = DomTestHelper.createElementFromContent(testID, content);
    let startNode = testDiv.firstChild;
    let endNode = testDiv.lastChild;
    let startEndBlockElement = new StartEndBlockElement(startNode, endNode);
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

describe('StartEndBlockElement getFirstInlineElement()', () => {
    function runTest(input: string, startOffset: number, endOffset: number, node: Node) {
        // Arrange
        let [blockElement] = createStartEndBlockElementWithContent(input);
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElement = blockElement.getFirstInlineElement();

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
        let startPosition = new Position(node, startOffset);
        let endPosition = new Position(node, endOffset);

        // Act
        let inlineElement = blockElement.getLastInlineElement();

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

    it('nodeBlockElement.containerNode equals node', () => {
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
