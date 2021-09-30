import createEditorCore from './createMockEditorCore';
import { ContentPosition } from 'roosterjs-editor-types';
import { getSelectionRange } from '../../lib/coreApi/getSelectionRange';
import { insertNode } from '../../lib/coreApi/insertNode';
import { itFirefoxOnly, selectNode } from '../TestHelper';

describe('insertNode', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('insert at beginning of empty editor', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<div id="div1"></div>');
    });

    it('insert at beginning of editor with content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div id="div2"><div id="div1"></div></div><div id="div3"></div>'
        );
    });

    it('insert at beginning of editor with void node as content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<br>';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<div id="div1"></div><br>');
    });

    it('insert at beginning of editor with text node as content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = 'test';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<div id="div1"></div>test');
    });

    it('insert at beginning of editor with deep level node as content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<span><br>test</span>';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<span><div id="div1"></div><br>test</span>');
    });

    it('insert at end of editor with deep level node as content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<span><br>test</span>';
        insertNode(core, node, {
            position: ContentPosition.End,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<span><br>test<div id="div1"></div></span>');
    });

    it('insert at the end of editor with content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.End,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div id="div2"></div><div id="div3"><div id="div1"></div></div>'
        );
    });

    it('insert at DOM end of editor with content', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('div');
        node.id = 'div1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.DomEnd,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div id="div2"></div><div id="div3"></div><div id="div1"></div>'
        );
    });

    it('insert at beginning not on new line', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div id="div2"><span id="span1"></span></div><div id="div3"></div>'
        );
    });

    it('insert at beginning on new line', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.Begin,
            insertOnNewLine: true,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div><span id="span1"></span></div><div id="div2"></div><div id="div3"></div>'
        );
    });

    it('insert at selection without focus', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        insertNode(core, node, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe('<div id="div2"></div><div id="div3"></div>');
    });

    itFirefoxOnly(
        'insert at selection with focus, no replace, no new line, no update cursor',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
            selectNode(document.getElementById('div2'));
            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: false,
                updateCursor: false,
                replaceSelection: false,
            });

            expect(div.innerHTML).toBe(
                '<span id="span1"></span><div id="div2"></div><div id="div3"></div>'
            );
        }
    );

    itFirefoxOnly('insert at selection with focus, replace, no new line, no update cursor', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.contentEditable = 'true';
        div.innerHTML = '<div id="div2"></div><div id="div3"></div>';
        selectNode(document.getElementById('div2'));
        insertNode(core, node, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: true,
        });

        expect(div.innerHTML).toBe('<span id="span1"></span><div id="div3"></div>');
    });

    itFirefoxOnly(
        'insert at selection with focus, no replace, new line and no element block, no update cursor',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML = '<span id="span2"></span><br><span id="span3"></span>';
            selectNode(document.getElementById('span2'));
            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: true,
                updateCursor: false,
                replaceSelection: false,
            });

            expect(div.innerHTML).toBe(
                '<span id="span2"></span><br><span id="span1"></span><span id="span3"></span>'
            );
        }
    );

    itFirefoxOnly(
        'insert at selection with focus, no replace, new line with parent block, no update cursor',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML = '<div><span id="span2"></span><span id="span3"></span></div>';
            selectNode(document.getElementById('span2'));
            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: true,
                updateCursor: false,
                replaceSelection: false,
            });

            expect(div.innerHTML).toBe(
                '<div><span id="span2"></span><span id="span3"></span></div><span id="span1"></span>'
            );
        }
    );

    itFirefoxOnly('insert at selection with focus, no replace, no new line, update cursor', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.contentEditable = 'true';
        div.innerHTML = '<div><span id="span2"></span><span id="span3"></span></div>';
        selectNode(document.getElementById('span2'));
        insertNode(core, node, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: false,
            updateCursor: true,
            replaceSelection: false,
        });

        expect(div.innerHTML).toBe(
            '<div><span id="span1"></span><span id="span2"></span><span id="span3"></span></div>'
        );

        const range = getSelectionRange(core, false);
        const span2 = document.getElementById('span2');
        expect(range.startContainer).toBe(span2);
        expect(range.endContainer).toBe(span2);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(0);
    });

    it('insert outside', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        insertNode(core, node, {
            position: ContentPosition.Outside,
            insertOnNewLine: false,
            updateCursor: false,
            replaceSelection: false,
        });

        expect((<HTMLElement>div.nextSibling).outerHTML).toBe('<span id="span1"></span>');
        node.parentNode.removeChild(node);
    });
});
