import Editor from '../editor/Editor';
import EditorOptions from '../interfaces/EditorOptions';
import EditorPlugin from '../interfaces/EditorPlugin';
import UndoService from '../interfaces/UndoService';

export * from 'roosterjs-editor-dom/lib/test/DomTestHelper';

export function initEditor(
    id: string,
    plugins?: EditorPlugin[],
    undo?: UndoService,
    customData?: { [key: string]: any }
) {
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
        customData: customData,
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
