import * as DomTestHelper from '../DomTestHelper';
import shouldSkipNode from '../../lib/utils/shouldSkipNode';

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

    it('CRLF+text textNode', () => {
        // Arrange
        let node = document.createTextNode('\r\ntest');

        // Act
        let shouldSkip = shouldSkipNode(node);

        // Assert
        expect(shouldSkip).toBe(false);
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

    it('Node contains empty DIV/SPAN only', () => {
        // Arrange
        const node = document.createElement('div');
        node.innerHTML = '<span><div></div><div></div></span>';

        // Act
        const shouldSkip = shouldSkipNode(node);

        // Assert
        expect(shouldSkip).toBe(true);
    });

    it('Node contains space only, set trim to true', () => {
        // Arrange
        const node = document.createElement('div');
        node.innerHTML = '  <div>  </div>  ';

        // Act
        const shouldSkip = shouldSkipNode(node, true /*ignoreSpace*/);

        // Assert
        expect(shouldSkip).toBe(true);
    });
});
