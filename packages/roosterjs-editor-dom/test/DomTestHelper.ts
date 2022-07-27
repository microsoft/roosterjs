import createRange from '../lib/selection/createRange';
import getInlineElementAtNode from '../lib/inlineElements/getInlineElementAtNode';
import NodeBlockElement from '../lib/blockElements/NodeBlockElement';
import StartEndBlockElement from '../lib/blockElements/StartEndBlockElement';
import { Browser } from '../lib/utils/Browser';
import { InlineElement, NodePosition } from 'roosterjs-editor-types';

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

// Check inlineElement equality based on start, end and textContent
export function isInlineElementEqual(
    element: InlineElement,
    start: NodePosition,
    end: NodePosition,
    textContent: string
): boolean {
    return (
        arePositionsEqual(element.getStartPosition(), start) &&
        arePositionsEqual(element.getEndPosition(), end) &&
        element.getTextContent() == textContent
    );
}

// Check if two positions are equal
function arePositionsEqual(point1: NodePosition, point2: NodePosition): boolean {
    return point1.node.isEqualNode(point2.node) && point1.offset == point2.offset;
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
    let startEndBlockElement = new StartEndBlockElement(rootNode, startNode, endNode);
    return startEndBlockElement;
}

// Create inlineElement from node
export function createInlineElementFromNode(node: Node, rootNode: Node): InlineElement {
    let parentBlock = new NodeBlockElement(node as HTMLElement);
    let inlineElement = getInlineElementAtNode(parentBlock, node);
    return inlineElement;
}

// Create range from child nodes of given node
export function createRangeFromChildNodes(node: Node): Range {
    return createRange(node.firstChild, node.lastChild);
}

// Create range from given HTMLElement
export function createRangeWithDiv(testDiv: HTMLElement): Range {
    return createRange(testDiv);
}

export function htmlToDom(html: string): Node[] {
    let element = document.createElement('DIV');
    element.innerHTML = html;

    return [].slice.call(element.childNodes);
}

export function itFirefoxOnly(
    expectation: string,
    assertion?: jasmine.ImplementationCallback,
    timeout?: number
) {
    const func = Browser.isFirefox ? it : xit;
    return func(expectation, assertion, timeout);
}

export function itChromeOnly(
    expectation: string,
    assertion?: jasmine.ImplementationCallback,
    timeout?: number
) {
    const func = Browser.isChrome ? it : xit;
    return func(expectation, assertion, timeout);
}
