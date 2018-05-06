import EditorCore, { HasFocus } from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

const hasFocus: HasFocus = (core: EditorCore) => {
    return contains(core.contentDiv, core.document.activeElement, true /*treatSameNodeAsContain*/);
};

export default hasFocus;
