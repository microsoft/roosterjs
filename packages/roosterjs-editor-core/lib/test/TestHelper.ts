import Editor from '../editor/Editor';
import EditorOptions from '../editor/EditorOptions';
import EditorPlugin from '../editor/EditorPlugin';
import UndoService from '../editor/UndoService';

export * from 'roosterjs-editor-dom/lib/test/DomTestHelper';

export function initEditor(id: string, plugins?: EditorPlugin[], undo?: UndoService) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: EditorOptions = {
        plugins,
        undo,
        defaultFormat: {
            fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
            fontSize: '11pt',
            textColor: '#000000',
        },
    };

    let editor = new Editor(node as HTMLDivElement, options);

    return editor;
}

// Select a node
export function selectNode(node: Node) {
    let range = document.createRange();
    range.setStartBefore(node);
    range.setEndAfter(node);
    addRange(range);
}

// Add range to the document's selection
function addRange(range: Range) {
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
