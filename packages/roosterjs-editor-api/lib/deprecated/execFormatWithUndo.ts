import { Editor } from 'roosterjs-editor-core';
import { EditorPoint } from 'roosterjs-editor-types';

/**
 * @deprecated Use Editor.editWithUndo() instead
 * Formatter function type
 * @param startPoint Current selection start point
 * @param endPoint Current selection end point
 * @returns A fallback node for selection. When original selection range is not valid after format,
 * will try to select this element instead
 */
export type Formatter = (startPoint?: EditorPoint, endPoint?: EditorPoint) => Node | void | any;

/**
 * @deprecated Use Editor.editWithUndo() instead
 */
export default function execFormatWithUndo(
    editor: Editor,
    formatter: Formatter,
    preserveSelection?: boolean
) {
    editor.addUndoSnapshot((start, end) => {
        let startPoint = {
            containerNode: start.node,
            offset: start.offset,
        };
        let endPoint = {
            containerNode: end.node,
            offset: end.offset,
        };
        let node = formatter(startPoint, endPoint);
        if (
            preserveSelection &&
            !editor.select(
                startPoint.containerNode,
                startPoint.offset,
                endPoint.containerNode,
                endPoint.offset
            ) &&
            node instanceof Node
        ) {
            editor.select(node);
        }
    });
}
