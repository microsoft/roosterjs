import * as DomTestHelper from '../DomTestHelper';
import getInlineElementAtNode from '../../inlineElements/getInlineElementAtNode';
import NodeBlockElement from '../../blockElements/NodeBlockElement';
import PartialInlineElement from '../../inlineElements/PartialInlineElement';
import Position from '../../selection/Position';
import { InlineElement, PositionType } from 'roosterjs-editor-types';
import { NodeInlineElement } from '../..';

let testID = 'NodeInlineElement';

function createNodeInlineElement(inlineElementContent: string): InlineElement {
    let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
    let parentBlock = new NodeBlockElement(testDiv);
    let inlineElement = getInlineElementAtNode(parentBlock, testDiv.firstChild);

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
        expect(startPosition.offset).toBe(PositionType.Begin);
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
        expect(startPosition.offset).toBe(PositionType.Begin);
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
        expect(endPosition.isAtEnd).toBe(true);
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
        let parentBlock = new NodeBlockElement(testDiv);
        let element1 = getInlineElementAtNode(parentBlock, testDiv.firstChild);
        let element2 = getInlineElementAtNode(parentBlock, testDiv.lastChild);

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
        let parentBlock1 = new NodeBlockElement(testDiv1);
        let parentBlock2 = new NodeBlockElement(testDiv2);
        let element1 = getInlineElementAtNode(parentBlock1, testDiv1.firstChild);
        let element2 = getInlineElementAtNode(parentBlock2, testDiv2.firstChild);

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
        let parentBlock = new NodeBlockElement(testDiv);
        let element = getInlineElementAtNode(parentBlock, testDiv.firstChild);
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
        let parentBlock = new NodeBlockElement(testDiv);
        let element = getInlineElementAtNode(parentBlock, testDiv.firstChild.firstChild);
        let position = new Position(testDiv.firstChild.lastChild, PositionType.End);

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

    it('from = null, to = null', () => {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let parentBlock = new NodeBlockElement(testDiv);
        let element = getInlineElementAtNode(parentBlock, testDiv.firstChild);
        let mockColor = 'red';

        // Act
        element.applyStyle(function (node: HTMLElement) {
            node.style.color = mockColor;
        });

        // Assert
        expect(testDiv.innerHTML).toBe('<span style="color: red;">www.example.com</span>');
    });
});

describe('isTextualInlineElement()', () => {
    it('input = <Text NodeInlineElement>', () => {
        runTest(new NodeInlineElement(document.createTextNode('test'), null), true);
    });

    it('input = <PartialInlineElement>{}', () => {
        runTest(
            new PartialInlineElement(new NodeInlineElement(document.createElement('span'), null)),
            false
        );
    });

    it('input = PartialInlineElement with Text NodeInlineElement as decoratedInline', () => {
        let mockInlineElement = new PartialInlineElement(
            new NodeInlineElement(document.createTextNode('test'), null)
        );
        runTest(mockInlineElement, true);
    });

    function runTest(input: InlineElement, output: boolean) {
        let result = input.isTextualInlineElement();
        expect(result).toBe(output);
    }
});
