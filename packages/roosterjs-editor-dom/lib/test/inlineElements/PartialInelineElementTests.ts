import * as TestHelper from '../DomTestHelper';
import NodeInlineElement from '../../inlineElements/NodeInlineElement';
import PartialInlineElement from '../../inlineElements/PartialInlineElement';
import Position from '../../selection/Position';
import resolveInlineElement from '../../inlineElements/resolveInlineElement';
import { InlineElement } from 'roosterjs-editor-types';
import { NodeBlockElement } from '../../blockElements/BlockElement';

let testID = 'PartialInlineElement';

function createPartialInlineElementWithContent(
    inlineElementContent: string,
    startOffset: number,
    endOffset: number
): [PartialInlineElement, InlineElement, NodeBlockElement, HTMLElement] {
    let testDiv = TestHelper.createElementFromContent(testID, inlineElementContent);
    let [partialInlineElement, inlineElement, testParentBlock] = createPartialInlineElementWithDiv(
        testDiv,
        startOffset,
        endOffset
    );
    return [partialInlineElement, inlineElement, testParentBlock, testDiv];
}

function createPartialInlineElementWithSpan(
    span: HTMLElement,
    startOffset: number,
    endOffset: number
): [PartialInlineElement, InlineElement, NodeBlockElement] {
    let testParentBlock = new NodeBlockElement(span.parentNode);
    let inlineElement = new NodeInlineElement(span, testParentBlock);
    let startPosition = startOffset ? new Position(span.firstChild, startOffset) : null;
    let endPosition = endOffset ? new Position(span.firstChild, endOffset) : null;
    let partialInlineElement = new PartialInlineElement(
        inlineElement,
        startPosition ? startPosition.toEditorPoint() : null,
        endPosition ? endPosition.toEditorPoint() : null
    );
    return [partialInlineElement, inlineElement, testParentBlock];
}

function createPartialInlineElementWithDiv(
    testDiv: HTMLElement,
    startOffset: number,
    endOffset: number
): [PartialInlineElement, InlineElement, NodeBlockElement] {
    let testParentBlock = new NodeBlockElement(testDiv);
    let inlineElement = resolveInlineElement(testDiv.firstChild, testDiv, testParentBlock);
    let startPoint = startOffset
        ? { containerNode: testDiv.firstChild.firstChild, offset: startOffset }
        : null;
    let endPoint = endOffset
        ? { containerNode: testDiv.firstChild.lastChild, offset: endOffset }
        : null;
    let partialInlineElement = new PartialInlineElement(inlineElement, startPoint, endPoint);
    return [partialInlineElement, inlineElement, testParentBlock];
}

describe('PartialInlineElement getDecoratedInline()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, inlineElement] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let decoratedInline = partialInlineElement.getDecoratedInline();

        // Assert
        expect(decoratedInline).toBe(inlineElement);
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement getContainerNode()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, , , testDiv] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let containerNode = partialInlineElement.getContainerNode();

        // Assert
        expect(containerNode).toBe(testDiv.firstChild);
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement getParentBlock()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, , testParentBlock] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let parentBlock = partialInlineElement.getParentBlock();

        // Assert
        expect(parentBlock).toBe(testParentBlock);
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement getTextContent()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number], output: string) {
        // Arrange
        let [partialInlineElement] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let textContent = partialInlineElement.getTextContent();

        // Assert
        expect(textContent).toBe(output);
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/], 'example.com');
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11], 'www.example');
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11], 'example');
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4], '');
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3], '');
    });
});

describe('PartialInlineElement getStartPoint()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, , , testDiv] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let startPoint = partialInlineElement.getStartPoint();

        // Assert
        expect(startPoint).toEqual({
            containerNode: testDiv.firstChild.firstChild,
            offset: input[1] || 0,
        });
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement getEndPoint()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number], output: number) {
        // Arrange
        let [partialInlineElement, , , testDiv] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        let endPoint = partialInlineElement.getEndPoint();

        // Assert
        expect(endPoint).toEqual({ containerNode: testDiv.firstChild.firstChild, offset: output });
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/], 15);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11], 11);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11], 11);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4], 4);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3], 3);
    });
});

describe('PartialInlineElement nextInlineElement', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, inlineElement] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );
        let endPoint = partialInlineElement.getEndPoint();

        // Act
        let nextInline = partialInlineElement.nextInlineElement;

        // Assert
        expect(nextInline).toEqual(
            input[2] ? new PartialInlineElement(inlineElement, endPoint, null /*endPoint*/) : null
        );
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement previousInlineElement', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number]) {
        // Arrange
        let [partialInlineElement, inlineElement] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );
        let startPoint = partialInlineElement.getStartPoint();

        // Act
        let previousInline = partialInlineElement.previousInlineElement;

        // Assert
        expect(previousInline).toEqual(
            input[1] ? new PartialInlineElement(inlineElement, null /*endPoint*/, startPoint) : null
        );
    }

    it('Partial on start point', () => {
        runTest(['<span>www.example.com</span>', 4, null /*endOffset*/]);
    });

    it('Partial on end point', () => {
        runTest(['<span>www.example.com</span>', null /*startOffset*/, 11]);
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 11]);
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4]);
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 3]);
    });
});

describe('PartialInlineElement contains()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number, number], output: boolean) {
        // Arrange
        let [partialInlineElement, , , testDiv] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );
        let editorPoint = { containerNode: testDiv.firstChild.firstChild, offset: input[3] };

        // Act
        let elementContainsPoint = partialInlineElement.contains(editorPoint);

        // Assert
        expect(elementContainsPoint).toBe(output);
    }

    it('partialElement.startOffset < editorPoint.offSet < partialElement.endOffset', () => {
        runTest(['<span>www.example.com</span>', 3, 14, 13], true);
    });

    it('partialElement.endOffset = editorPoint.offSet', () => {
        runTest(['<span>www.example.com</span>', 3, 14, 14], false);
    });

    it('partialElement.endOffset < editorPoint.offSet', () => {
        runTest(['<span>www.example.com</span>', 3, 14, 15], false);
    });

    it('partialElement.startOffset = editorPoint.offSet', () => {
        runTest(['<span>www.example.com</span>', 3, 14, 3], false);
    });

    it('partialElement.startOffset > editorPoint.offSet', () => {
        runTest(['<span>www.example.com</span>', 3, 14, 2], false);
    });
});

describe('PartialInlineElement isAfter()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(
        testDiv1: HTMLElement,
        testDiv2: HTMLElement,
        startOffset1: number,
        endOffset1: number,
        startOffset2: number,
        endOffset2: number,
        output: [boolean, boolean]
    ) {
        // Arrange
        let [element1] = createPartialInlineElementWithDiv(testDiv1, startOffset1, endOffset1);
        let [element2] = createPartialInlineElementWithDiv(testDiv2, startOffset2, endOffset2);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(output[0]);
        expect(isElement1AfterElement2).toBe(output[1]);
    }

    function runTest2(
        span1: HTMLElement,
        span2: HTMLElement,
        startOffset1: number,
        endOffset1: number,
        startOffset2: number,
        endOffset2: number,
        output: [boolean, boolean]
    ) {
        // Arrange
        let [element1] = createPartialInlineElementWithSpan(span1, startOffset1, endOffset1);
        let [element2] = createPartialInlineElementWithSpan(span2, startOffset2, endOffset2);

        // Act
        let isElement2AfterElement1 = element2.isAfter(element1);
        let isElement1AfterElement2 = element1.isAfter(element2);

        // Assert
        expect(isElement2AfterElement1).toBe(output[0]);
        expect(isElement1AfterElement2).toBe(output[1]);
    }

    it('container node of element2 is after container node of element1', () => {
        let testDiv = TestHelper.createElementFromContent(
            testID,
            '<span>node1</span><span>text</span><span>node2</span>'
        );
        runTest2(testDiv.firstChild as HTMLElement, testDiv.lastChild as HTMLElement, 0, 2, 0, 1, [
            true,
            false,
        ]);
    });

    it('Both elements reside in same inlineElement, element2.startOffset > element1.endOffset', () => {
        let testDiv = TestHelper.createElementFromContent(testID, '<span>www.example.com</span>');
        runTest(testDiv, testDiv, 0, 2, 3, 4, [true, false]);
    });

    it('Both elements reside in same inlineElement, element2.startOffset = element1.endOffset', () => {
        // Arrange
        let testDiv = TestHelper.createElementFromContent(testID, '<span>www.example.com</span>');
        runTest(testDiv, testDiv, 0, 2, 2, 4, [true, false]);
    });

    it('Both elements reside in same inlineElement, element2.startOffset < element1.endOffset', () => {
        // Arrange
        let testDiv = TestHelper.createElementFromContent(testID, '<span>www.example.com</span>');
        runTest(testDiv, testDiv, 0, 2, 1, 4, [false, false]);
    });
});

describe('PartialInlineElement applyStyle()', () => {
    afterEach(() => {
        TestHelper.removeElement(testID);
    });

    function runTest(input: [string, number, number], output: string) {
        // Arrange
        let [partialInlineElement, , , testDiv] = createPartialInlineElementWithContent(
            input[0],
            input[1],
            input[2]
        );

        // Act
        partialInlineElement.applyStyle(function(node: HTMLElement) {
            node.style.color = 'red';
        });

        // Assert
        expect(testDiv.innerHTML).toBe(output);
    }

    it('Partial on start point', () => {
        runTest(
            ['<span>www.example.com</span>', 4, null /*endOffset*/],
            '<span>www.</span><span style="color: red;">example.com</span>'
        );
    });

    it('Partial on end point', () => {
        runTest(
            ['<span>www.example.com</span>', null /*startOffset*/, 11],
            '<span style="color: red;">www.example</span><span>.com</span>'
        );
    });

    it('Partial on start point and end point, startOffset < endOffset', () => {
        runTest(
            ['<span>www.example.com</span>', 4, 11],
            '<span>www.</span><span style="color: red;">example</span><span>.com</span>'
        );
    });

    it('Partial on start point and end point, startOffset = endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 4], '<span>www.example.com</span>');
    });

    it('Partial on start point and end point, startOffset > endOffset', () => {
        runTest(['<span>www.example.com</span>', 4, 2], '<span>www.example.com</span>');
    });
});
