import EditorCore from '../editor/EditorCore';

export default function getSelection(core: EditorCore) {
    let win = (core.document || document).defaultView || window;
    return win.getSelection();
}
