import EditorCore from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

export default function hasFocus(core: EditorCore): boolean {
    return contains(core.contentDiv, core.document.activeElement, true /*treatSameNodeAsContain*/);
}
