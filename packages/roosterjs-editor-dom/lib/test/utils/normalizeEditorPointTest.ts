import * as DomTestHelper from '../DomTestHelper';
import normalizeEditorPoint from '../../deprecated/normalizeEditorPoint';
import { NodeType } from 'roosterjs-editor-types';

describe('normalizeEditorPoint()', () => {
    let testID = 'normalizeEditorPoint';

    it('input data = ["<div><div>aaa</div><div></div><div>bbb</div></div>", 0]', () => {
        runTest(
            ['<div><div>aaa</div><div></div><div>bbb</div></div>', 0],
            [0, NodeType.Text, 'aaa']
        );
    });

    it('input data = ["<div><div>aaa</div><div></div><div>bbb</div></div>", 1]', () => {
        runTest(
            ['<div><div>aaa</div><div></div><div>bbb</div></div>', 1],
            [0, NodeType.Element, null]
        );
    });

    it('input data = ["<div><div>aaa</div><div></div><div>bbb</div></div>", 2]', () => {
        runTest(
            ['<div><div>aaa</div><div></div><div>bbb</div></div>', 2],
            [0, NodeType.Text, 'bbb']
        );
    });

    it('input data = ["<div><div>aaa</div><div></div><div>bbb</div></div>", 3]', () => {
        runTest(
            ['<div><div>aaa</div><div></div><div>bbb</div></div>', 3],
            [3, NodeType.Text, 'bbb']
        );
    });

    it('input data = ["<div></br></div>", 0]', () => {
        runTest(['<div></br></div>', 0], [0, NodeType.Element, null]);
    });

    it('input data = ["hello", 5]', () => {
        runTest(['hello', 5], [5, NodeType.Text, 'hello']);
    });

    it('input data = ["hello", 3]', () => {
        runTest(['hello', 3], [3, NodeType.Text, 'hello']);
    });

    function runTest(input: [string, number], output: [number, NodeType, string]) {
        // Arrange
        let testDiv = DomTestHelper.createElementFromContent(testID, input[0]);

        // Act
        let result = normalizeEditorPoint(testDiv.firstChild, input[1]);

        // Assert
        expect(result.containerNode.hasChildNodes()).toBe(false);
        expect(result.offset).toBe(output[0]);
        expect(result.containerNode.nodeType).toBe(output[1]);
        expect(result.containerNode.nodeValue).toBe(output[2]);

        // Clean up
        DomTestHelper.removeElement(testID);
    }
});
