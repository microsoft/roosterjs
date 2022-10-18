import createEditorCore from './createMockEditorCore';
import { addRange, itFirefoxOnly, selectNode } from '../TestHelper';
import { ContentPosition } from 'roosterjs-editor-types';
import { getSelectionRange } from '../../lib/coreApi/getSelectionRange';
import { insertNode } from '../../lib/coreApi/insertNode';

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

    itFirefoxOnly(
        'insert at selection with focus, no replace, no new line, update cursor in a not content editable element',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML =
                '<div contenteditable="false"><span id="span2"></span><span id="span3"></span></div>';
            div.focus();
            selectNode(document.getElementById('span2'));
            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: false,
                updateCursor: true,
                replaceSelection: true,
            });

            expect(div.innerHTML).toBe(
                '<div contenteditable="false"><span id="span3"></span></div><span id="span1"></span>'
            );

            const range = getSelectionRange(core, false);
            const span2 = document.getElementById('span1');

            expect(range.startContainer).toBe(span2);
            expect(range.endContainer).toBe(span2);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(0);
        }
    );

    itFirefoxOnly('Insert Node in new line when selection inside of a table cell', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('span');
        node.id = 'span1';
        div.contentEditable = 'true';
        div.innerHTML = '<div><table><tr><td><span id="span2"></span></td></tr></table></div>';
        div.focus();
        selectNode(document.getElementById('span2')!);
        insertNode(core, node, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: true,
            updateCursor: true,
            replaceSelection: true,
        });

        expect(div.innerHTML).toBe(
            '<div><table><tbody><tr><td><div><span id="span1"></span></div></td></tr></tbody></table></div>'
        );

        const range = getSelectionRange(core, false);
        const span2 = document.getElementById('span1');

        expect(range.startContainer).toBe(span2);
        expect(range.endContainer).toBe(span2);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(0);
    });

    itFirefoxOnly(
        'Insert Node in new line when selection inside of a table cell between spans',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML =
                '<div><table><tr><td><span>Test1</span><span id="span2"></span><span>Test2</span></td></tr></table></div>';
            div.focus();
            selectNode(document.getElementById('span2')!);
            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: true,
                updateCursor: true,
                replaceSelection: true,
            });

            expect(div.innerHTML).toBe(
                '<div><table><tbody><tr><td><span>Test1</span><div><span id="span1"></span></div><span>Test2</span></td></tr></tbody></table></div>'
            );

            const range = getSelectionRange(core, false);
            const span2 = document.getElementById('span1');

            expect(range.startContainer).toBe(span2);
            expect(range.endContainer).toBe(span2);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(0);
        }
    );

    itFirefoxOnly(
        'Insert Node in new line when selection inside of a table cell between spans',
        () => {
            const core = createEditorCore(div, {});
            const node = document.createElement('span');
            node.id = 'span1';
            div.contentEditable = 'true';
            div.innerHTML =
                '<div><table><tr><td><span id="span2">Test1</span></td></tr></table></div>';
            div.focus();
            const sel = document.createRange();
            sel.setStart(document.getElementById('span2')!.firstChild!, 2);
            addRange(sel);

            insertNode(core, node, {
                position: ContentPosition.SelectionStart,
                insertOnNewLine: true,
                updateCursor: true,
                replaceSelection: true,
            });

            expect(div.innerHTML).toBe(
                '<div><table><tbody><tr><td><span id="span2">Te<div><span id="span1"></span></div>st1</span></td></tr></tbody></table></div>'
            );

            const range = getSelectionRange(core, false);
            const span2 = document.getElementById('span1');

            expect(range.startContainer).toBe(span2);
            expect(range.endContainer).toBe(span2);
            expect(range.startOffset).toBe(0);
            expect(range.endOffset).toBe(0);
        }
    );

    it('Add a line between tables', () => {
        const core = createEditorCore(div, {});
        const node = document.createElement('table');
        node.id = 'table1';
        div.contentEditable = 'true';
        div.innerHTML = '<div id="div"><table></table></div>';
        div.focus();
        const sel = document.createRange();
        sel.setStart(document.getElementById('div')!, 1);
        addRange(sel);

        insertNode(core, node, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: false,
            updateCursor: true,
            replaceSelection: true,
        });
        expect(div.innerHTML).toBe(
            '<div id="div"><table></table><br><table id="table1"></table></div>'
        );
    });

    it('Insert node at root of region', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';
        div.innerHTML =
            '<div><div>textBefore</div><div id="innerDiv">text</div><div>textAfter</div></div>';
        div.focus();

        const text = div.querySelector('#innerDiv')!.firstChild!;
        const sel = document.createRange();
        sel.setStart(text, 2);
        sel.setEnd(text, 2);
        addRange(sel);

        const nodeToInsert = document.createElement('div');
        nodeToInsert.id = 'newDiv';

        insertNode(core, nodeToInsert, {
            position: ContentPosition.SelectionStart,
            insertOnNewLine: true,
            updateCursor: true,
            replaceSelection: true,
            insertToRegionRoot: true,
        });
        expect(div.innerHTML).toBe(
            '<div><div>textBefore</div><div id="innerDiv">te</div></div><div id="newDiv"></div><div><div>xt</div><div>textAfter</div></div>'
        );
    });
});
