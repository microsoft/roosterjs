import NodeBlockElement from '../blockElements/NodeBlockElement';
import NodeInlineElement from '../inlineElements/NodeInlineElement';
import InlineElement from '../inlineElements/InlineElement';
import Position from '../selection/Position';
import PositionType from '../selection/PositionType';
import SelectionRange from '../selection/SelectionRange';
import StartEndBlockElement from '../blockElements/StartEndBlockElement';

// Create element with content and id and insert the element in the DOM
export function createElementFromContent(id: string, content: string): HTMLElement {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);
    node.innerHTML = content;

    return node;
}

// Remove the element with id from the DOM
export function removeElement(id: string) {
    let node = document.getElementById(id);
    if (node) {
        node.parentNode.removeChild(node);
    }
}

// Run test for the method with one parameter
export function runTestMethod1(input: any, output: any, testMethod: (input: any) => any) {
    // Act
    let result = testMethod(input);

    // Assert
    expect(result).toBe(output);
}

// Run test for the method with two parameters
export function runTestMethod2(
    input: [any, any],
    output: any,
    testMethod: (input1: any, input2: any) => any
) {
    // Act
    let result = testMethod(input[0], input[1]);

    // Assert
    expect(result).toEqual(output);
}

// Check inlineElement equality based on startPosition, endPosition and textContent
export function isInlineElementEqual(
    element: InlineElement,
    startPosition: Position,
    endPosition: Position,
    textContent: string
): boolean {
    return (
        isPositionEqual(element.getStartPosition(), startPosition) &&
        isPositionEqual(element.getEndPosition(), endPosition) &&
        element.getTextContent() == textContent
    );
}

// Check if two editor points are equal
export function isPositionEqual(position1: Position, position2: Position): boolean {
    return position1.node.isEqualNode(position2.node) && position1.offset == position2.offset;
}

// Create NodeBlockElement from given HTMLElement
export function createNodeBlockElementWithDiv(testDiv: HTMLElement): NodeBlockElement {
    let nodeBlockElement = new NodeBlockElement(testDiv);
    return nodeBlockElement;
}

// Create StartEndBlockElement with start and end nodes
export function createStartEndBlockElementWithStartEndNode(
    rootNode: HTMLElement,
    startNode: Node,
    endNode: Node
): StartEndBlockElement {
    let startEndBlockElement = new StartEndBlockElement(startNode, endNode);
    return startEndBlockElement;
}

// Create inlineElement from node
export function createInlineElementFromNode(node: Node, rootNode: Node): InlineElement {
    let inlineElement = new NodeInlineElement(node);
    return inlineElement;
}

// Create range from child nodes of given node
export function createRangeFromChildNodes(node: Node): SelectionRange {
    return new SelectionRange(
        new Position(node.firstChild, PositionType.Before),
        new Position(node.lastChild, PositionType.After)
    );
}

// Create range from given HTMLElement
export function createRangeWithDiv(testDiv: HTMLElement): SelectionRange {
    return new SelectionRange(
        new Position(testDiv, PositionType.Before),
        new Position(testDiv, PositionType.After)
    );
}
