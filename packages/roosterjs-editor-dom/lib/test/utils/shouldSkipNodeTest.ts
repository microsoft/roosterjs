import * as DomTestHelper from '../DomTestHelper';
import shouldSkipNode from '../../utils/shouldSkipNode';

let testID = 'shouldSkipNode';

describe('shouldSkipNode, shouldSkipNode()', () => {
    afterAll(() => {
        DomTestHelper.removeElement(testID);
    });

    it('Empty textNode', () => {
        // Arrange
        let node = document.createTextNode('');

        // Act
        let shouldSkip = shouldSkipNode(node);

        // Assert
        expect(shouldSkip).toBe(true);
    });

    it('CRLFOnly textNode', () => {
        // Arrange
        let node = document.createTextNode('\r\n');

        // Act
        let shouldSkip = shouldSkipNode(node);

        // Assert
        expect(shouldSkip).toBe(true);
    });

    it('DisplayNone', () => {
        // Arrange
        let node = DomTestHelper.createElementFromContent(
            testID,
            '<div style="display: none">abc</div>'
        );

        // Act
        let shouldSkip = shouldSkipNode(node.firstChild);

        // Assert
        expect(shouldSkip).toBe(true);
    });

    it('Empty DIV node', () => {
        // Arrange
        let node = DomTestHelper.createElementFromContent(testID, '<div></div>');

        // Act
        let shouldSkip = shouldSkipNode(node.firstChild);

        // Assert
        expect(shouldSkip).toBe(true);
    });

    it('Regular node', () => {
        // Arrange
        let node = document.createTextNode('abc');

        // Act
        let shouldSkip = shouldSkipNode(node);

        // Assert
        expect(shouldSkip).toBe(false);
    });
});
