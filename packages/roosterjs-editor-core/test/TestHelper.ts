import Editor from '../lib/editor/Editor';
import { EditorOptions, EditorPlugin } from 'roosterjs-editor-types';

export * from 'roosterjs-editor-dom/test/DomTestHelper';

export function initEditor(id: string, plugins?: EditorPlugin[]) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let options: EditorOptions = {
        plugins,
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
export function addRange(range: Range) {
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
