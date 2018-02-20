import * as DomTestHelper from '../DomTestHelper';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import {
    getInlineElementAtNode,
    getFirstInlineElement,
    getLastInlineElement,
    getNextInlineElement,
    getPreviousInlineElement,
    getInlineElementBefore,
    getInlineElementAfter,
} from '../../blockElements/BlockElement';
import { Position, PositionType, InlineElement } from 'roosterjs-editor-types';

let testID = 'getInlineElement';
let inlineElementFactory: InlineElementFactory;

describe('getInlineElement getInlineElementAtNode()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        node: Node,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = Position.create(testNode, startOffset);
        let endPosition = Position.create(testNode, endOffset);

        // Act
        let inlineElement = getInlineElementAtNode(rootNode, node, inlineElementFactory);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, inlineElementAtNode = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild, rootNode.firstChild.firstChild, 0, 15);
    });

    it('input = <p><br></p>, inlineElementAtNode = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild, rootNode.firstChild.firstChild, 0, Position.End);
    });

    it('input = <div>abc<br>123</div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, rootNode.firstChild.firstChild, 0, 3);
    });

    it('input = <div>abc<div>123</div></div>, inlineElementAtNode = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.firstChild, rootNode.firstChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getFirstInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = Position.create(testNode, startOffset);
        let endPosition = Position.create(testNode, endOffset);

        // Act
        let inlineElement = getFirstInlineElement(rootNode, inlineElementFactory);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, firstInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, 0, 15);
    });

    it('input = <p><br></p>, firstInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, 0, Position.End);
    });

    it('input = <div>abc<br>123</div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, 0, 3);
    });

    it('input = <div>abc<div>123</div></div>, firstInlineElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getLastInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = Position.create(testNode, startOffset);
        let endPosition = Position.create(testNode, endOffset);

        // Act
        let inlineElement = getLastInlineElement(rootNode, inlineElementFactory);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <div>www.example.com</div>, lastInlineElement = www.example.com', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        runTest(rootNode, rootNode.firstChild.firstChild, 0, 15);
    });

    it('input = <p><br></p>, lastInlineElement = <br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        runTest(rootNode, rootNode.firstChild.firstChild, 0, Position.End);
    });

    it('input = <div>abc<br>123</div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        runTest(rootNode, rootNode.firstChild.lastChild, 0, 3);
    });

    it('input = <div>abc<div>123</div></div>, lastInlineElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        runTest(rootNode, rootNode.firstChild.lastChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getNextInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = Position.create(testNode, startOffset);
        let endPosition = Position.create(testNode, endOffset);

        // Act
        let inlineElement = getNextInlineElement(rootNode, currentInline, inlineElementFactory);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
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
        let nextInline = getNextInlineElement(rootNode, currentInline, inlineElementFactory);

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
        let nextInline = getNextInlineElement(rootNode, currentInline, inlineElementFactory);

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
            0,
            Position.End
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
        runTest(rootNode, currentInline, rootNode.firstChild.lastChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getPreviousInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        currentInline: InlineElement,
        testNode: Node,
        startOffset: number | PositionType,
        endOffset: number | PositionType
    ) {
        // Arrange
        let startPosition = Position.create(testNode, startOffset);
        let endPosition = Position.create(testNode, endOffset);

        // Act
        let inlineElement = getPreviousInlineElement(rootNode, currentInline, inlineElementFactory);

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElement,
                startPosition,
                endPosition,
                testNode.textContent.substr(startPosition.offset, endPosition.offset)
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
        let previousInline = getPreviousInlineElement(
            rootNode,
            currentInline,
            inlineElementFactory
        );

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
        let previousInline = getPreviousInlineElement(
            rootNode,
            currentInline,
            inlineElementFactory
        );

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
            0,
            Position.End
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
        runTest(rootNode, currentInline, rootNode.firstChild.firstChild, 0, 3);
    });
});

describe('getInlineElement getInlineElementBeforePoint()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        position: Position,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);

        // Act
        let inlineElementBeforePoint = getInlineElementBefore(
            rootNode,
            position,
            inlineElementFactory
        );

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementBeforePoint,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, position at beginning, inlineElementBeforePoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = Position.create(rootNode.firstChild, 0);

        // Act
        let inlineElementBeforePoint = getInlineElementBefore(
            rootNode,
            position,
            inlineElementFactory
        );

        // Assert
        expect(inlineElementBeforePoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementBeforePoint = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = Position.create(rootNode.lastChild, 0);
        runTest(rootNode, position, 0, 3, rootNode.firstChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement before selection, inlineElementBeforePoint = www', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let position = Position.create(rootNode.firstChild.firstChild, 3);
        runTest(rootNode, position, 0, 3, rootNode.firstChild.firstChild);
    });
});

describe('getInlineElement getInlineElementAfterPoint()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(
        rootNode: Node,
        position: Position,
        startOffset: number | PositionType,
        endOffset: number | PositionType,
        node: Node
    ) {
        // Arrange
        let startPosition = Position.create(node, startOffset);
        let endPosition = Position.create(node, endOffset);

        // Act
        let inlineElementAfterPoint = getInlineElementAfter(
            rootNode,
            position,
            inlineElementFactory
        );

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementAfterPoint,
                startPosition,
                endPosition,
                node.textContent.substr(startPosition.offset, endPosition.offset)
            )
        ).toBe(true);
    }

    it('input = <span>abc</span><span>123</span>, position at end, inlineElementAfterPoint = null', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = Position.create(rootNode.lastChild, Position.End);

        // Act
        let inlineElementAfterPoint = getInlineElementAfter(
            rootNode,
            position,
            inlineElementFactory
        );

        // Assert
        expect(inlineElementAfterPoint).toBe(null);
    });

    it('input = <span>abc</span><span>123</span>, inlineElementAfterPoint = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>abc</span><span>123</span>'
        );
        let position = Position.create(rootNode.firstChild, Position.End);
        runTest(rootNode, position, 0, 3, rootNode.lastChild.firstChild);
    });

    it('input = <span>www.example.com</span>, partial inlineElement after position, inlineElementAfterPoint = com', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let position = Position.create(rootNode.firstChild.firstChild, 12);
        runTest(rootNode, position, 12, 15, rootNode.firstChild.firstChild);
    });
});
