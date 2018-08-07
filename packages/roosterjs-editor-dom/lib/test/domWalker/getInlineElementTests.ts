import * as DomTestHelper from '../DomTestHelper';
import {
    getInlineElementAtNode,
    getFirstInlineElement,
    getLastInlineElement,
    getNextPreviousInlineElement,
} from '../../blockElements/BlockElement';
import { NodeBoundary, InlineElement, EditorPoint } from 'roosterjs-editor-types';
import {
    getInlineElementBeforePoint,
    getInlineElementAfterPoint,
} from '../../deprecated/getInlineElementBeforeAfterPoint';

let testID = 'getInlineElement';

describe('getInlineElement getInlineElementAtNode()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        node: Node,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = { containerNode: testNode, offset: startOffset };
        let endPoint = { containerNode: testNode, offset: endOffset };

        // Act
        let inlineElement = getInlineElementAtNode(rootNode, node);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, inlineElementAtNode = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(
            rootNode,
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            NodeBoundary.Begin,
            15
        );
    });

    it('input = <p><br></p>, inlineElementAtNode = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(
            rootNode,
            rootNode.firstChild,
            rootNode.firstChild.firstChild,
            NodeBoundary.Begin,
            NodeBoundary.End
        );
    });

    it('input = <div>abc<br>123</div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild,
            NodeBoundary.Begin,
            3
        );
    });

    it('input = <div>abc<div>123</div></div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild,
            NodeBoundary.Begin,
            3
        );
    });
});

describe('getInlineElement getFirstInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node, startOffset: number, endOffset: number) {
        // Arrange
        let startPoint = { containerNode: testNode, offset: startOffset };
        let endPoint = { containerNode: testNode, offset: endOffset };

        // Act
        let inlineElement = getFirstInlineElement(rootNode);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, firstInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, 15);
    });

    it('input = <p><br></p>, firstInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, NodeBoundary.End);
    });

    it('input = <div>abc<br>123</div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, 3);
    });

    it('input = <div>abc<div>123</div></div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, 3);
    });
});

describe('getInlineElement getLastInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(rootNode: Node, testNode: Node, startOffset: number, endOffset: number) {
        // Arrange
        let startPoint = { containerNode: testNode, offset: startOffset };
        let endPoint = { containerNode: testNode, offset: endOffset };

        // Act
        let inlineElement = getLastInlineElement(rootNode);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, lastInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, 15);
    });

    it('input = <p><br></p>, lastInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, NodeBoundary.Begin, NodeBoundary.End);
    });

    it('input = <div>abc<br>123</div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.lastChild, NodeBoundary.Begin, 3);
    });

    it('input = <div>abc<div>123</div></div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.lastChild.firstChild, NodeBoundary.Begin, 3);
    });
});

describe('getInlineElement getNextInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = { containerNode: testNode, offset: startOffset };
        let endPoint = { containerNode: testNode, offset: endOffset };

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, nextInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let nextInline = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(nextInline).toBe(null);
    });

    it('input = <p><br></p>, nextInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let nextInline = getNextPreviousInlineElement(rootNode, currentInline, true);

        // Assert
        expect(nextInline).toBe(null);
    });

    it('input = <div>abc<br>123</div>, nextInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.firstChild.nextSibling,
            NodeBoundary.Begin,
            NodeBoundary.End
        );
    });

    it('input = <div>abc<div>123</div></div>, nextInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.lastChild.firstChild,
            NodeBoundary.Begin,
            3
        );
    });
});

describe('getInlineElement getPreviousInlineElement()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number,
        endOffset: number
    ) {
        // Arrange
        let startPoint = { containerNode: testNode, offset: startOffset };
        let endPoint = { containerNode: testNode, offset: endOffset };

        // Act
        let inlineElement = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPoint,
                endPoint,
                testNode.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, previousInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let previousInline = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(previousInline).toBe(null);
    });

    it('input = <p><br></p>, previousInlineElement = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild,
            rootNode
        );

        // Act
        let previousInline = getNextPreviousInlineElement(rootNode, currentInline, false);

        // Assert
        expect(previousInline).toBe(null);
    });

    it('input = <div>abc<br>123</div>, previousInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.lastChild,
            rootNode
        );
        runTest(
            rootNode,
            currentInline,
            rootNode.firstChild.firstChild.nextSibling,
            NodeBoundary.Begin,
            NodeBoundary.End
        );
    });

    it('input = <div>abc<div>123</div></div>, previousInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let currentInline = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.lastChild,
            rootNode
        );
        runTest(rootNode, currentInline, rootNode.firstChild.firstChild, NodeBoundary.Begin, 3);
    });
});

describe('getInlineElement getInlineElementBeforePoint()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        editorPoint: EditorPoint,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };

        // Act
        let inlineElementBeforePoint = getInlineElementBeforePoint(rootNode, editorPoint);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementBeforePoint,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, editorPoint at beginning, inlineElementBeforePoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let editorPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };

        // Act
        let inlineElementBeforePoint = getInlineElementBeforePoint(rootNode, editorPoint);

        // Assert
        expect(inlineElementBeforePoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementBeforePoint = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let editorPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.Begin };
        runTest(rootNode, editorPoint, NodeBoundary.Begin, 3, rootNode.firstChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement before selection, inlineElementBeforePoint = www', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let editorPoint = { containerNode: rootNode.firstChild.firstChild, offset: 3 };
        runTest(rootNode, editorPoint, NodeBoundary.Begin, 3, rootNode.firstChild.firstChild);
    });
});

describe('getInlineElement getInlineElementAfterPoint()', () => {
    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    function runTest(
        rootNode: Node,
        editorPoint: EditorPoint,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };

        // Act
        let inlineElementAfterPoint = getInlineElementAfterPoint(rootNode, editorPoint);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementAfterPoint,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, editorPoint at end, inlineElementAfterPoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let editorPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.End };

        // Act
        let inlineElementAfterPoint = getInlineElementAfterPoint(rootNode, editorPoint);

        // Assert
        expect(inlineElementAfterPoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementAfterPoint = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let editorPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };
        runTest(rootNode, editorPoint, NodeBoundary.Begin, 3, rootNode.lastChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement after editorPoint, inlineElementAfterPoint = com', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let editorPoint = { containerNode: rootNode.firstChild.firstChild, offset: 12 };
        runTest(rootNode, editorPoint, 12, 15, rootNode.firstChild.firstChild);
    });
});
