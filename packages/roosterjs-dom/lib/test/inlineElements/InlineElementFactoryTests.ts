import * as DomTestHelper from '../DomTestHelper';
import { BlockElement, InlineElement } from 'roosterjs-types';
import InlineElementFactory from '../../inlineElements/InlineElementFactory';
import InlineElementResolver from '../../inlineElements/InlineElementResolver';
import LinkInlineElement from '../../inlineElements/LinkInlineElement';
import NodeBlockElement from '../../blockElements/NodeBlockElement';
import NodeInlineElement from '../../inlineElements/NodeInlineElement';

describe('InlineElementFactory resolve() resolves an inline element using the default inline element resolver', () => {
    let testID = 'InlineElementFactory_resolve_default';

    afterEach(() => {
        // Clean up
        DomTestHelper.removeElement(testID);
    });

    it('test content="<a>www.example.com</a>"', () => {
        // Arrange
        let inlineElementFactory = new InlineElementFactory(null);
        let inlineElementContent = '<a>www.example.com</a>';
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);

        // Act
        let inlineElement = inlineElementFactory.resolve(testDiv.firstChild, testDiv, parentBlock);

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof LinkInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('test content="<a><span>www.example.com</span></a>"', () => {
        // Arrange
        let inlineElementFactory = new InlineElementFactory(null);
        let inlineElementContent = '<a><span>www.example.com</span></a>';
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);

        // Act
        let inlineElement = inlineElementFactory.resolve(
            testDiv.firstChild.firstChild,
            testDiv,
            parentBlock
        );

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof LinkInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('test content="<span><a>www.example.com</a></span>"', () => {
        // Arrange
        let inlineElementFactory = new InlineElementFactory(null);
        let inlineElementContent = '<a><span>www.example.com</span></a>';
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);

        // Act
        let inlineElement = inlineElementFactory.resolve(testDiv.firstChild, testDiv, parentBlock);

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof LinkInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('test content="<span>www.example.com</span>"', () => {
        // Arrange
        let inlineElementFactory = new InlineElementFactory(null);
        let inlineElementContent = '<span>www.example.com</span>';
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);

        // Act
        let inlineElement = inlineElementFactory.resolve(testDiv.firstChild, testDiv, parentBlock);

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof NodeInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });
});

describe('InlineElementFactory resolve()', () => {
    let testID = 'InlineElementFactory_resolve_custom';

    afterEach(() => {
        // Clean up
        DomTestHelper.removeElement(testID);
    });

    it('resolves an inline element using the custom inline element resolver', () => {
        // Arrange
        let customResolvers = [new MockInlineElementResolver()];
        let inlineElementFactory = new InlineElementFactory(customResolvers);
        let inlineElementContent = '<span>www.example.com</span>';
        let testDiv = DomTestHelper.createElementFromContent(testID, inlineElementContent);
        let parentBlock = new NodeBlockElement(testDiv, null);

        // Act
        let inlineElement = inlineElementFactory.resolve(testDiv.firstChild, testDiv, parentBlock);

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof MockInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    class MockInlineElement extends NodeInlineElement {
        constructor(
            containerNode: Node,
            rootNode: Node,
            parentBlock: BlockElement,
            inlineElementFactory: InlineElementFactory
        ) {
            super(containerNode, rootNode, parentBlock, inlineElementFactory);
        }
    }

    class MockInlineElementResolver implements InlineElementResolver {
        public resolve(
            node: Node,
            rootNode: Node,
            parentBlock: BlockElement,
            inlineElementFactory: InlineElementFactory
        ): InlineElement {
            return new MockInlineElement(node, rootNode, parentBlock, inlineElementFactory);
        }
    }
});
