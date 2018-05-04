import EditorCore, { HasFocus } from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

const hasFocus: HasFocus = (core: EditorCore) => {
    let activeElement = core.document.activeElement;
    return (
        activeElement &&
        (core.contentDiv == activeElement || contains(core.contentDiv, activeElement))
    );
};

export default hasFocus;
