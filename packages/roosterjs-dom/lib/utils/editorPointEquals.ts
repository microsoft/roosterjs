import { EditorPoint } from 'roosterjs-types';

// Checks if the two EditorPoint points to same location
export default function editorPointEquals(point1: EditorPoint, point2: EditorPoint): boolean {
    return point1.containerNode == point2.containerNode && point1.offset == point2.offset;
}
