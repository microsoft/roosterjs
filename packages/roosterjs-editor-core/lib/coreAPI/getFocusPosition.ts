import EditorCore from '../editor/EditorCore';
import { Position, contains } from 'roosterjs-editor-dom';

export default function getFocusPosition(core: EditorCore) {
    let selection = core.document.defaultView.getSelection();
    return selection && contains(core.contentDiv, selection.focusNode)
        ? new Position(selection.focusNode, selection.focusOffset)
        : null;
}
