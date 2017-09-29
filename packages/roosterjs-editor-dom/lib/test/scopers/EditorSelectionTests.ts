import * as DomTestHelper from '../DomTestHelper';
import EditorSelection from '../../scopers/EditorSelection';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import { BlockElement, NodeBoundary } from 'roosterjs-editor-types';

let testID = 'EditorSelection';
let inlineElementFactory: InlineElementFactory;

describe('EditorSelection collapsed()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    it('input = <span>www.example.com</span>, editorSelection is collapsed', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);

        // collapse to end
        selectionRange.collapse(false);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let isCollapsed = editorSelection.collapsed;

        // Assert
        expect(isCollapsed).toBe(true);
    });

    it('input = <span>www.example.com</span>, editorSelection is collapsed', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);

        // collapse to start
        selectionRange.collapse(true);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let isCollapsed = editorSelection.collapsed;

        // Assert
        expect(isCollapsed).toBe(true);
    });

    it('input = <span>www.example.com</span>, editorSelection is collapsed', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let isCollapsed = editorSelection.collapsed;

        // Assert
        expect(isCollapsed).toBe(false);
    });
});

describe('EditorSelection inlineElementBeforeStart()', () => {
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
        selectionRange: Range,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let inlineElementBeforeStart = editorSelection.inlineElementBeforeStart;

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                inlineElementBeforeStart,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>part1</span><span>part2</span>, complete inlineElement before selection', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.End };
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('part1');
        runTest(rootNode, selectionRange, NodeBoundary.Begin, 5, node);
    });

    it('input = <span>part1</span><span>part2</span>, no inlineElement before selection', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let inlineElementBeforeStart = editorSelection.inlineElementBeforeStart;

        // Assert
        expect(inlineElementBeforeStart).toBe(null);
    });

    it('input = <span>www.example.com</span>, partial inlineElement before selection', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let startPoint = { containerNode: rootNode.firstChild.firstChild, offset: 3 };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 15 };

        // selectionRange is '.example.com'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, selectionRange, NodeBoundary.Begin, 3, node);
    });
});

describe('EditorSelection startInlineElement()', () => {
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
        selectionRange: Range,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let startInline = editorSelection.startInlineElement;

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                startInline,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>www.example.com</span>, startInlineElement is PartialInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let startPoint = { containerNode: rootNode.firstChild.firstChild, offset: 3 };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 15 };

        // selectionRange is '.example.com'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, selectionRange, 3, 15, node);
    });

    it('input = <span>www.example.com</span>, startInlineElement is TextInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };

        // selectionRange is '<span>www.example.com</span>'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, selectionRange, NodeBoundary.Begin, 15, node);
    });

    it('input = <img>www.example.com, startInlineElment is ImageInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<img>www.example.com');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createElement('img');
        runTest(rootNode, range, NodeBoundary.Begin, NodeBoundary.End, node);
    });
});

describe('EditorSelection endInlineElement()', () => {
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
        selectionRange: Range,
        startOffset: number,
        endOffset: number,
        node: Node
    ) {
        // Arrange
        let startPoint = { containerNode: node, offset: startOffset };
        let endPoint = { containerNode: node, offset: endOffset };
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let endInline = editorSelection.endInlineElement;

        // Assert
        expect(
            DomTestHelper.isInlineElementEqual(
                endInline,
                startPoint,
                endPoint,
                node.textContent.substr(startOffset, endOffset)
            )
        ).toBe(true);
    }

    it('input = <span>www.example.com</span>, endInlineElement is PartialInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>www.example.com</span>'
        );
        let startPoint = { containerNode: rootNode.firstChild.firstChild, offset: 3 };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 15 };

        // selectionRange is '.example.com'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let node = document.createTextNode('www.example.com');
        runTest(rootNode, selectionRange, 3, 15, node);
    });

    it('input = <span>part1</span><span>part2</span>, startInlineElement is TextInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<span>part1</span><span>part2</span>'
        );
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createTextNode('part2');
        runTest(rootNode, selectionRange, NodeBoundary.Begin, 5, node);
    });

    it('input = www.example.com<img>, startInlineElment is ImageInlineElement', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, 'www.example.com<img>');
        let range = DomTestHelper.createRangeFromChildNodes(rootNode);
        let node = document.createElement('img');
        runTest(rootNode, range, NodeBoundary.Begin, NodeBoundary.End, node);
    });
});

describe('EditorSelection startBlockElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(rootNode: Node, selectionRange: Range, testBlockElement: BlockElement) {
        // Arrange
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let startBlockElement = editorSelection.startBlockElement;

        // Assert
        let isBlockElementEqual = startBlockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, startBlockElement = <div>www.example.com</div>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <p><br></p>, startBlockElement = <p><br></p>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <div>abc<br>123</div>, startBlockElement = abc<br>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild.nextSibling
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, startBlockElement = abc', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.firstChild,
            rootNode.firstChild.firstChild
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });
});

describe('EditorSelection endBlockElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    function runTest(rootNode: Node, selectionRange: Range, testBlockElement: BlockElement) {
        // Arrange
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let endBlockElement = editorSelection.endBlockElement;

        // Assert
        let isBlockElementEqual = endBlockElement.equals(testBlockElement);
        expect(isBlockElementEqual).toBe(true);
    }

    it('input = <div>www.example.com</div>, endBlockElement = <div>www.example.com</div>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>www.example.com</div>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <p><br></p>, endBlockElement = <p><br></p>', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p><br></p>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <div>abc<br>123</div>, endBlockElement = 123', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<div>abc<br>123</div>');
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });

    it('input = <div>abc<div>123</div></div>, endBlockElement = <div>123</div>', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<div>abc<div>123</div></div>'
        );
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.firstChild as HTMLElement);
        let testBlockElement = DomTestHelper.createStartEndBlockElementWithStartEndNode(
            rootNode,
            rootNode.firstChild.lastChild,
            rootNode.firstChild.lastChild
        );
        runTest(rootNode, selectionRange, testBlockElement as BlockElement);
    });
});

describe('EditorSelection trimInlineElement()', () => {
    beforeAll(() => {
        inlineElementFactory = new InlineElementFactory(null);
    });

    afterEach(() => {
        DomTestHelper.removeElement(testID);
    });

    afterAll(() => {
        inlineElementFactory = null;
    });

    it('input = <div>abc</div>, collapsed selection', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);
        selectionRange.collapse(false);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = editorSelection.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBe(null);
    });

    it('input = <p>part1</p><p>part2</p>, inlineElement inside selectionRange', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };

        // range is '<p>part1</p>'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // inlineElement is 'part1'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = editorSelection.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBe(inlineElement);
    });

    it('input = <p>part1</p><p>part2</p>, inlineElement complete outside selectionRange', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>part1</p><p>part2</p>');
        let startPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.Begin };
        let endPoint = { containerNode: rootNode.firstChild, offset: NodeBoundary.End };

        // range is '<p>part1</p>'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // inlineElement is 'part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.lastChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = editorSelection.trimInlineElement(inlineElement);

        // Assert
        expect(trimmedElement).toBeUndefined();
    });

    it('input = <span>part1,part2</span>, part of inlineElement is out of scope', () => {
        // Arrange
        let rootNode = DomTestHelper.createElementFromContent(testID, '<span>part1,part2</span>');
        let startPoint = {
            containerNode: rootNode.firstChild.firstChild,
            offset: NodeBoundary.Begin,
        };
        let endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 5 };

        // range is 'part1'
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // inlineElement is 'part1,part2'
        let inlineElement = DomTestHelper.createInlineElementFromNode(
            rootNode.firstChild.firstChild,
            rootNode
        );

        // Act
        let trimmedElement = editorSelection.trimInlineElement(inlineElement);

        // Assert
        startPoint = { containerNode: rootNode.firstChild.firstChild, offset: NodeBoundary.Begin };
        endPoint = { containerNode: rootNode.firstChild.firstChild, offset: 5 };
        expect(
            DomTestHelper.isInlineElementEqual(trimmedElement, startPoint, endPoint, 'part1')
        ).toBe(true);
    });
});

describe('EditorSelection isBlockInScope()', () => {
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
        selectionRange: Range,
        testBlockElement: BlockElement,
        output: boolean
    ) {
        // Arrange
        let editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);

        // Act
        let isTestBlockInScope = editorSelection.isBlockInScope(testBlockElement);

        // Assert
        expect(isTestBlockInScope).toBe(output);
    }

    it('input = <p>abc</p><p>123</p>, the start of selection falls on the block', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>abc</p><p>123</p>');
        let startPoint = {
            containerNode: rootNode.firstChild.firstChild,
            offset: 2,
        };
        let endPoint = { containerNode: rootNode.lastChild, offset: NodeBoundary.End };
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.firstChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement, true);
    });

    it('input = <p>abc</p><p>123</p>, the end of selection falls on the block', () => {
        let rootNode = DomTestHelper.createElementFromContent(testID, '<p>abc</p><p>123</p>');
        let startPoint = {
            containerNode: rootNode.firstChild,
            offset: NodeBoundary.Begin,
        };
        let endPoint = { containerNode: rootNode.lastChild.firstChild, offset: 1 };
        let selectionRange = DomTestHelper.createRangeWithStartEndNode(startPoint, endPoint);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(
            rootNode.lastChild as HTMLElement
        );
        runTest(rootNode, selectionRange, testBlockElement, true);
    });

    it('input = <p>abc</p><p>123</p><p>456</p>, the block falls in-between selection start and end', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<p>abc</p><p>123</p><p>456</p>'
        );
        let selectionRange = DomTestHelper.createRangeFromChildNodes(rootNode);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(rootNode.firstChild
            .nextSibling as HTMLElement);
        runTest(rootNode, selectionRange, testBlockElement, true);
    });

    it('input = <p>abc</p><p>123</p><p>456</p>, the block falls outside selection', () => {
        let rootNode = DomTestHelper.createElementFromContent(
            testID,
            '<p>abc</p><p>123</p><p>456</p>'
        );
        let selectionRange = DomTestHelper.createRangeWithDiv(rootNode.lastChild as HTMLElement);
        let testBlockElement = DomTestHelper.createNodeBlockElementWithDiv(rootNode.firstChild
            .nextSibling as HTMLElement);
        runTest(rootNode, selectionRange, testBlockElement, false);
    });
});
