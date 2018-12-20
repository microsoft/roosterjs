import { Editor, EditorPlugin, UndoService } from 'roosterjs-editor-core';
import { NodeType } from 'roosterjs-editor-types';

export * from 'roosterjs-editor-dom/lib/test/DomTestHelper';

export function initEditor(id: string, plugins?: EditorPlugin[], undo?: UndoService) {
    let node = document.createElement('div');
    node.id = id;
    document.body.insertBefore(node, document.body.childNodes[0]);

    let editor = new Editor(node as HTMLDivElement, {
        plugins: plugins || [],
        defaultFormat: { textColor: 'black', fontFamily: 'times new roman' },
        undo: undo,
    });

    return editor;
}

// Select a node
export function selectNode(node: Node) {
    let range = document.createRange();
    range.setStartBefore(node);
    range.setEndAfter(node);
    addRange(range);
}

// Select a text node
export function selectText(textNode: Node, start: number, end: number) {
    let range = document.createRange();
    range.setStart(textNode, start);
    range.setEnd(textNode, end);
    addRange(range);
}

// Set a selection by node and offset
export function setSelection(node: Node, offset: number) {
    let range = document.createRange();
    if (node.nodeType == NodeType.Text) {
        range.setStart(node, offset);
    } else if (offset == 0) {
        range.setStartBefore(node);
    } else {
        range.setStartAfter(node);
    }

    range.collapse(true);
    addRange(range);
}

// Add range to the document's selection
function addRange(range: Range) {
    let sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
