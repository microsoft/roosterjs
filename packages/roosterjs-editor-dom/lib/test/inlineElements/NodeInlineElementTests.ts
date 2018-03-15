import * as DomTestHelper from '../DomTestHelper';
import InlineElement from '../../inlineElements/InlineElement';
import NodeInlineElement from '../../inlineElements/NodeInlineElement';
import Position from '../../selection/Position';

let testID = 'NodeInlineElement';

function createNodeInlineElement(inlineElementContent: string): InlineElement {
    let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
    let inlineElement = new NodeInlineElement(testDiv.firstChild);

    return inlineElement;
}

describe('NodeInlineElement getTextContent()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span><span>hello</span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span><span>hello</span>www.example.com</span>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('hellowww.example.com');
    });

    it('input = <a>www.example.com</a>', () => {
        // Arrange
        let element = createNodeInlineElement('<a>www.example.com</a>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('www.example.com');
    });

    it('input = <img>', () => {
        // Arrange
        let element = createNodeInlineElement('<img>');

        // Act
        let textContent = element.getTextContent();

        // Assert
        expect(textContent).toBe('');
    });
});

describe('NodeInlineElement getStartPosition()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');

        // Act
        let startPosition = element.getStartPosition();

        // Assert
        expect(startPosition.node.textContent).toBe('www.example.com');
        expect(startPosition.offset).toBe(0);
    });

    it('input = <span><a><span>part1</span>text</a>text<span>part2</span>part3</span>', () => {
        // Arrange
        let element = createNodeInlineElement(
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );

        // Act
        let startPosition = element.getStartPosition();

        // Assert
        expect(startPosition.node.textContent).toBe('part1');
        expect(startPosition.offset).toBe(0);
    });
});

describe('NodeInlineElement getEndPosition()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('input = <span>www.example.com</span>', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');

        // Act
        let endPosition = element.getEndPosition();

        // Assert
        expect(endPosition.node.textContent).toBe('www.example.com');
        expect(endPosition.offset).toBe(15);
    });

    it('input = <span>part1<span>part2</span><a><span>part3</span></a></span>', () => {
        // Arrange
        let element = createNodeInlineElement(
            '<span>part1<span>part2</span><a><span>part3</span></a></span>'
        );

        // Act
        let endPosition = element.getEndPosition();

        // Assert
        expect(endPosition.node.textContent).toBe('part3');
        expect(endPosition.offset).toBe(5);
    });

    it('input = <img>', () => {
        // Arrange
        let element = createNodeInlineElement('<img>');

        // Act
        let endPosition = element.getEndPosition();

        // Assert
        expect(endPosition.node.textContent).toBe('');
        expect(endPosition.offset).toBe(0);
    });
});

describe('NodeInlineElement isAfter()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('element2 is after element1, both elements are in same BlockElement', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>node1</span><span>text</span><span>node2</span>'
        );
        let element1 = new NodeInlineElement(testDiv.firstChild);
        let element2 = new NodeInlineElement(testDiv.lastChild);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(true);
        expect(isElement1AfterElement2).toBe(false);
    });

    it('element2 is after element1, and each element is in differnt BlockElement', () => {
        // Arrange
        let div = DomTestHelper.createElementFromContent(testID, '');
        let testDiv1 = DomTestHelper.createElementFromContent(
            'testDiv1',
            '<span>node1</span><span>text</span>'
        );
        let testDiv2 = DomTestHelper.createElementFromContent('testDiv2', '<span>node2</span>');
        div.appendChild(testDiv2);
        div.insertBefore(testDiv1, testDiv2);
        let element1 = new NodeInlineElement(testDiv1.firstChild);
        let element2 = new NodeInlineElement(testDiv2.firstChild);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(true);
        expect(isElement1AfterElement2).toBe(false);
    });
});

describe('NodeInlineElement contains()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    it('element contains position', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let position = new Position(testDiv.firstChild.lastChild, 3);

        // Act
        let elementContainsPosition = element.contains(position);

        // Assert
        expect(elementContainsPosition).toBe(true);
    });

    it('element does not contain position', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span><a><span>part1</span>text</a>text<span>part2</span>part3</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild.firstChild);
        let position = new Position(testDiv.firstChild.lastChild, Position.End);

        // Act
        let elementContainsPosition = element.contains(position);

        // Assert
        expect(elementContainsPosition).toBe(false);
    });
});

describe('NodeInlineElement applyStyle()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function getInnerHTML(element: InlineElement): string {
        let htmlElement = element.getContainerNode() as HTMLElement;
        let wrapper = document.createElement('div');
        wrapper.appendChild(htmlElement);
        return wrapper.innerHTML;
    }

    it('fromPosition = null, toPosition = null', () => {
        // Arrange
        let element = createNodeInlineElement('<span>www.example.com</span>');
        let mockColor = 'red';

        // Act
        element.applyStyle(function(node: HTMLElement) {
            node.style.color = mockColor;
        });

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span style="color: red;">www.example.com</span>');
    });

    it('fromPosition != null, toPosition != null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let fromPosition = new Position(testDiv.firstChild.firstChild, 3);
        let toPosition = new Position(testDiv.firstChild.lastChild, 11);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPosition,
            toPosition
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www<span style="color: red;">.example</span>.com</span>');
    });

    it('fromPosition != null, toPosition = null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let fromPosition = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPosition,
            null /*toPosition*/
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www<span style="color: red;">.example.com</span></span>');
    });

    it('fromPosition = null, toPosition != null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let toPosition = new Position(testDiv.firstChild.firstChild, 11);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            null /*fromPosition*/,
            toPosition
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span><span style="color: red;">www.example</span>.com</span>');
    });

    it('fromPosition != null, toPosition != null, fromPosition = toPosition', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let fromPosition = new Position(testDiv.firstChild.firstChild, 3);
        let toPosition = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPosition,
            toPosition
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www.example.com</span>');
    });

    it('fromPosition != null, toPosition != null, fromPosition is after toPosition', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let element = new NodeInlineElement(testDiv.firstChild);
        let fromPosition = new Position(testDiv.firstChild.firstChild, 4);
        let toPosition = new Position(testDiv.firstChild.firstChild, 3);
        let mockColor = 'red';

        // Act
        element.applyStyle(
            function(node: HTMLElement) {
                node.style.color = mockColor;
            },
            fromPosition,
            toPosition
        );

        // Assert
        let innerHTML = getInnerHTML(element);
        expect(innerHTML).toBe('<span>www.example.com</span>');
    });
});
