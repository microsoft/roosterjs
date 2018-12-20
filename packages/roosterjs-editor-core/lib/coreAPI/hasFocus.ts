import EditorCore, { HasFocus } from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

const hasFocus: HasFocus = (core: EditorCore) => {
    let activeElement = core.document.activeElement;
    return (
        activeElement && contains(core.contentDiv, activeElement, true /*treatSameNodeAsContain*/)
    );
};

export default hasFocus;
