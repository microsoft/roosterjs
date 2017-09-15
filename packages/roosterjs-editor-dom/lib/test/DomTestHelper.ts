import { InlineElement, EditorPoint } from 'roosterjs-editor-types';
import InlineElementFactory from '../inlineElements/InlineElementFactory';
import NodeBlockElement from '../blockElements/NodeBlockElement';
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
    expect(result).toBe(output);
}

// Check inlineElement equality based on startPoint, endPoint and textContent
export function isInlineElementEqual(
    element: InlineElement,
    startPoint: EditorPoint,
    endPoint: EditorPoint,
    textContent: string
): boolean {
    return (
        isEditorPointEqual(element.getStartPoint(), startPoint) &&
        isEditorPointEqual(element.getEndPoint(), endPoint) &&
        element.getTextContent() == textContent
    );
}

// Check if two editor points are equal
export function isEditorPointEqual(point1: EditorPoint, point2: EditorPoint): boolean {
    return point1.containerNode.isEqualNode(point2.containerNode) && point1.offset == point2.offset;
}

// Create NodeBlockElement from given HTMLElement
export function createNodeBlockElementWithDiv(testDiv: HTMLElement): NodeBlockElement {
    let inlineElementFactory = new InlineElementFactory(null);
    let nodeBlockElement = new NodeBlockElement(testDiv, inlineElementFactory);
    return nodeBlockElement;
}

// Create StartEndBlockElement with start and end nodes
export function createStartEndBlockElementWithStartEndNode(
    rootNode: HTMLElement,
    startNode: Node,
    endNode: Node
): StartEndBlockElement {
    let inlineElementFactory = new InlineElementFactory(null);
    let startEndBlockElement = new StartEndBlockElement(
        rootNode,
        startNode,
        endNode,
        inlineElementFactory
    );
    return startEndBlockElement;
}

// Create inlineElement from node
export function createInlineElementFromNode(node: Node, rootNode: Node): InlineElement {
    let inlineElementFactory = new InlineElementFactory(null);
    let parentBlock = new NodeBlockElement(node, null);
    let inlineElement = inlineElementFactory.resolve(node, rootNode, parentBlock);
    return inlineElement;
}

// Create range from child nodes of given node
export function createRangeFromChildNodes(node: Node): Range {
    let selectionRange = new Range();
    selectionRange.setStartBefore(node.firstChild);
    selectionRange.setEndAfter(node.lastChild);
    return selectionRange;
}

// Create range from start and end point
export function createRangeWithStartEndNode(startPoint: EditorPoint, endPoint: EditorPoint): Range {
    let selectionRange = new Range();
    selectionRange.setStart(startPoint.containerNode, startPoint.offset);
    selectionRange.setEnd(endPoint.containerNode, endPoint.offset);
    return selectionRange;
}

// Create range from given HTMLElement
export function createRangeWithDiv(testDiv: HTMLElement): Range {
    let selectionRange = new Range();
    selectionRange.setStartBefore(testDiv);
    selectionRange.setEndAfter(testDiv);
    return selectionRange;
}
