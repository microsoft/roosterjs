import * as DomTestHelper from '../DomTestHelper';
import { BlockElement } from 'roosterjs-editor-types';
import DefaultInlineElementResolver from '../../inlineElements/DefaultInlineElementResolver';
import ImageInlineElement from '../../inlineElements/ImageInlineElement';
import LinkInlineElement from '../../inlineElements/LinkInlineElement';
import TextInlineElement from '../../inlineElements/TextInlineElement';

describe('DefaultInlineElementResolver resolve()', () => {
    let testID = 'resolve';

    afterEach(() => {
        // Clean up
        DomTestHelper.removeElement(testID);
    });

    it('resolves as a LinkInlineElement if node tag is a', () => {
        // Arrange
        let input = '<a>www.example.com</a>';
        let testDiv = DomTestHelper.createElementFromContent(testID, input);
        let inlineElementResolve = new DefaultInlineElementResolver();
        let parentBlock = <BlockElement>{};

        // Act
        let inlineElement = inlineElementResolve.resolve(
            testDiv.firstChild /*node*/,
            null /*rootNode*/,
            parentBlock,
            null /*inlineElementFactory*/
        );

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof LinkInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('resolves as a ImageInlineElement if node tag is img', () => {
        // Arrange
        let input = '<img>';
        let testDiv = DomTestHelper.createElementFromContent(testID, input);
        let inlineElementResolve = new DefaultInlineElementResolver();
        let parentBlock = <BlockElement>{};

        // Act
        let inlineElement = inlineElementResolve.resolve(
            testDiv.firstChild /*node*/,
            null /*rootNode*/,
            parentBlock,
            null /*inlineElementFactory*/
        );

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof ImageInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('resolves as a TextInlineElement if node type is text', () => {
        // Arrange
        let input = 'text';
        let testDiv = DomTestHelper.createElementFromContent(testID, input);
        let inlineElementResolve = new DefaultInlineElementResolver();
        let parentBlock = <BlockElement>{};

        // Act
        let inlineElement = inlineElementResolve.resolve(
            testDiv.firstChild /*node*/,
            null /*rootNode*/,
            parentBlock,
            null /*inlineElementFactory*/
        );

        // Assert
        expect(inlineElement).toBeDefined();
        expect(inlineElement instanceof TextInlineElement).toBe(true);
        expect(inlineElement.getContainerNode()).toBe(testDiv.firstChild);
        expect(inlineElement.getParentBlock()).toBe(parentBlock);
    });

    it('resolves as nothing for other cases', () => {
        // Arrange
        let input = '<p><br></p>';
        let testDiv = DomTestHelper.createElementFromContent(testID, input);
        let inlineElementResolve = new DefaultInlineElementResolver();

        // Act
        let inlineElement = inlineElementResolve.resolve(
            testDiv.firstChild /*node*/,
            null /*rootNode*/,
            null /*parentBlock*/,
            null /*inlineElementFactory*/
        );

        // Assert
        expect(inlineElement).toBeNull();
    });
});
