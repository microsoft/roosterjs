import editorPointEquals from '../../utils/editorPointEquals';
import { EditorPoint } from 'roosterjs-types';

describe('editorPointEquals()', () => {
    it('returns true if the containerNode and offset of two editor points are the same', () => {
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
        let result = editorPointEquals(point1, point2);

        // Assert
        expect(result).toBe(true);
    });

    it('returns false if the containerNode of the two editor points are not the same', () => {
        // Arrange
        let mockNode1 = <Node>{};
        let mockNode2 = <Node>{};
        let point1 = <EditorPoint>{
            containerNode: mockNode1,
            offset: 1,
        };
        let point2 = <EditorPoint>{
            containerNode: mockNode2,
            offset: 1,
        };

        // Act
        let result = editorPointEquals(point1, point2);

        // Assert
        expect(result).toBe(false);
    });

    it('returns false if the offset of the two editor points are not the same', () => {
        // Arrange
        let mockNode = <Node>{};
        let point1 = <EditorPoint>{
            containerNode: mockNode,
            offset: 1,
        };
        let point2 = <EditorPoint>{
            containerNode: mockNode,
            offset: 2,
        };

        // Act
        let result = editorPointEquals(point1, point2);

        // Assert
        expect(result).toBe(false);
    });
});
