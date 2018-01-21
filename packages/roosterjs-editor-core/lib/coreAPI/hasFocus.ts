import EditorCore from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

export default function hasFocus(core: EditorCore): boolean {
    let activeElement = core.document.activeElement;
    return (
        activeElement &&
        (core.contentDiv == activeElement || contains(core.contentDiv, activeElement))
    );
}