import EditorCore, { GetFocusPosition } from '../editor/EditorCore';
import { Position, contains } from 'roosterjs-editor-dom';

const getFocusPosition: GetFocusPosition = (core: EditorCore) => {
    let selection = core.document.defaultView.getSelection();
    return selection && contains(core.contentDiv, selection.focusNode, true /*treatSameNodeAsContain*/)
        ? new Position(selection.focusNode, selection.focusOffset)
        : null;
};

export default getFocusPosition;