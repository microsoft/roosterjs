import * as isEditorPointAfter from '../../utils/isEditorPointAfter';
import * as isNodeAfter from '../../utils/isNodeAfter';
import { EditorPoint } from 'roosterjs-editor-types';

describe('isEditorPointAfter()', () => {
    it('returns true if the two point has the same container node and the offset of point1 is larger than point2', () => {
        // Arrange
        let mockNode = <Node>{};
        let point1 = <EditorPoint>{
            containerNode: mockNode,
            offset: 2,
        };
        let point2 = <EditorPoint>{
            containerNode: mockNode,
            offset: 1,
        };

        // Act
        let result = isEditorPointAfter.default(point1, point2);

        // Assert
        expect(result).toBe(true);
    });

    it("returns false if the two point has the same container node and the offset of point1 isn't larger than point2", () => {
        // Arrange
        let mockNode = <Node>{};
        let point1 = <EditorPoint>{
            containerNode: mockNode,
            offset: 1,
        };
        let point2 = <EditorPoint>{
            containerNode: mockNode,
            offset: 1,
        };

        // Act
        let result = isEditorPointAfter.default(point1, point2);

        // Assert
        expect(result).toBe(false);
    });

    it('returns true if the two point has different container node and the container node of point1 is after the container node of point2', () => {
        // Arrange
        spyOn(isNodeAfter, 'default').and.returnValue(true);
        let node1 = <Node>{};
        let node2 = <Node>{};
        let point1 = <EditorPoint>{ containerNode: node1, offset: 1 };
        let point2 = <EditorPoint>{ containerNode: node2, offset: 1 };

        // Act
        let result = isEditorPointAfter.default(point1, point2);

        // Assert
        expect(isNodeAfter.default).toHaveBeenCalledWith(node1, node2);
        expect(result).toBe(true);
    });

    it('returns false if the two point has different container node and the container node of point1 is after the container node of point2', () => {
        // Arrange
        spyOn(isNodeAfter, 'default').and.returnValue(false);
        let point1 = <EditorPoint>{ containerNode: <Node>{}, offset: 1 };
        let point2 = <EditorPoint>{ containerNode: <Node>{}, offset: 1 };

        // Act
        let result = isEditorPointAfter.default(point1, point2);

        // Assert
        expect(result).toBe(false);
    });
});
