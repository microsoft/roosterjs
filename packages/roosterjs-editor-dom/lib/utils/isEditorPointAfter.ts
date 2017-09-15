import isNodeAfter from './isNodeAfter';
import { EditorPoint } from 'roosterjs-editor-types';

// Checks if point1 is after point2
export default function isEditorPointAfter(point1: EditorPoint, point2: EditorPoint): boolean {
    return point1.containerNode == point2.containerNode
        ? point1.offset > point2.offset
        : isNodeAfter(point1.containerNode, point2.containerNode);
}
