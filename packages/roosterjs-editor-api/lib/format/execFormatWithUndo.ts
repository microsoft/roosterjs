import { Editor } from 'roosterjs-editor-core';
import { EditorPoint, NodeType } from 'roosterjs-editor-types';

/**
 * Formatter function type
 * @param startPoint Current selection start point
 * @param endPoint Current selection end point
 * @returns A fallback node for selection. When original selection range is not valid after format,
 * will try to select this element instead
 */
export type Formatter = (startPoint: EditorPoint, endPoint: EditorPoint) => Node | void | any;

/**
 * Execute format with undo
 * @param editor The editor instance
 * @param formatter The callback format function we want to perform, it also creates a fallback node for selection
 * given a start point and end point
 * @param preserveSelection (Optional) Whether to preserve selection, if set to true,
 * we update the selection to original selection range.
 */
export default function execFormatWithUndo(
    editor: Editor,
    formatter: Formatter,
    preserveSelection?: boolean
) {
    editor.addUndoSnapshot();
    let range = editor.getSelectionRange();
    let startPoint = range
        ? { containerNode: range.startContainer, offset: range.startOffset }
        : null;
    let endPoint = range ? { containerNode: range.endContainer, offset: range.endOffset } : null;

    let fallbackNode = formatter(startPoint, endPoint);
    editor.triggerContentChangedEvent('Format');

    if (preserveSelection && startPoint && endPoint) {
        updateSelection(editor, startPoint, endPoint, <Node>fallbackNode);
    }

    editor.addUndoSnapshot();
}

function updateSelection(
    editor: Editor,
    startPoint: EditorPoint,
    endPoint: EditorPoint,
    fallbackNode: Node
) {
    editor.focus();
    let range = editor.getDocument().createRange();

    if (validateEditorPoint(editor, startPoint) && validateEditorPoint(editor, endPoint)) {
        range.setStart(startPoint.containerNode, startPoint.offset);
        range.setEnd(endPoint.containerNode, endPoint.offset);
    } else if (fallbackNode instanceof Node) {
        range.selectNode(fallbackNode);
    } else {
        return;
    }

    editor.updateSelection(range);
}

function validateEditorPoint(editor: Editor, point: EditorPoint): boolean {
    if (point.containerNode && editor.contains(point.containerNode)) {
        if (point.containerNode.nodeType == NodeType.Text) {
            point.offset = Math.min(point.offset, (<Text>point.containerNode).data.length);
        } else if (point.containerNode.nodeType == NodeType.Element) {
            point.offset = Math.min(
                point.offset,
                (<HTMLElement>point.containerNode).childNodes.length
            );
        }
        return point.offset >= 0;
    }
    return false;
}
