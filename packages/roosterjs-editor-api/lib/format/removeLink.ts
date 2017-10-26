import execFormatWithUndo from './execFormatWithUndo';
import queryNodesWithSelection from '../cursor/queryNodesWithSelection';
import { normalizeEditorPoint, unwrap } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

export default function removeLink(editor: Editor): void {
    editor.focus();
    let nodes = queryNodesWithSelection(editor, 'a[href]');
    if (nodes.length) {
        execFormatWithUndo(editor, () => {
            let range = editor.getSelectionRange();
            let startPoint = range
                ? normalizeEditorPoint(range.startContainer, range.startOffset)
                : null;
            let endPoint = range ? normalizeEditorPoint(range.endContainer, range.endOffset) : null;
            for (let node of nodes) {
                unwrap(node);
            }
            if (
                range &&
                editor.contains(startPoint.containerNode) &&
                editor.contains(endPoint.containerNode)
            ) {
                let newRange = editor.getDocument().createRange();
                newRange.setStart(startPoint.containerNode, startPoint.offset);
                newRange.setEnd(endPoint.containerNode, endPoint.offset);
                editor.updateSelection(newRange);
            }
        });
    }
}
