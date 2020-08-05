import createEditorCore from '../../editor/createEditorCore';
import { focus } from '../../coreAPI/focus';
import { Position } from 'roosterjs-editor-dom';
import { selectRange } from '../../coreAPI/selectRange';

describe('selectRange', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('empty input', () => {
        const core = createEditorCore(div, {});
        const selected = selectRange(core, null);
        expect(selected).toBeFalsy();
    });

    it('range is out of editor', () => {
        const core = createEditorCore(div, {});
        const span = document.createElement('span');
        span.innerHTML = 'test';
        document.body.appendChild(span);
        const range = document.createRange();
        range.selectNode(span);

        const selected = selectRange(core, range);
        expect(selected).toBeFalsy();

        document.body.removeChild(span);
    });

    it('select single node', () => {
        const core = createEditorCore(div, {});
        const span = document.createElement('span');
        span.innerHTML = 'test';
        div.appendChild(span);
        const range = document.createRange();
        range.selectNode(span);

        const selected = selectRange(core, range);
        expect(selected).toBeTruthy();

        const result = window.getSelection().getRangeAt(0);
        expect(result.startContainer).toEqual(div);
        expect(result.endContainer).toEqual(div);
        expect(result.startOffset).toBe(0);
        expect(result.endOffset).toBe(1);

        expect(core.domEvent.value.selectionRange).toBe(result);
    });

    it('select single node after focus', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';

        const span = document.createElement('span');
        span.innerHTML = 'test';
        div.appendChild(span);
        const range = document.createRange();
        range.selectNode(span);

        focus(core);

        const selected = selectRange(core, range);
        expect(selected).toBeTruthy();

        const result = window.getSelection().getRangeAt(0);
        expect(result.startContainer).toEqual(div);
        expect(result.endContainer).toEqual(div);
        expect(result.startOffset).toBe(0);
        expect(result.endOffset).toBe(1);

        expect(core.domEvent.value.selectionRange).toBe(null);
    });

    it('select collapsed range', () => {
        const core = createEditorCore(div, {});
        const span = document.createElement('span');
        span.innerHTML = 'test';
        div.appendChild(span);
        div.contentEditable = 'true';
        const range = document.createRange();
        range.selectNode(span);
        range.collapse(true);

        core.domEvent.value.pendableFormatPosition = new Position(div, 0);
        core.domEvent.value.pendableFormatState = {
            isBold: true,
        };

        const selected = selectRange(core, range);
        expect(selected).toBeTruthy();

        const result = window.getSelection().getRangeAt(0);
        expect(result.startContainer).toEqual(div);
        expect(result.endContainer).toEqual(div);
        expect(result.startOffset).toBe(0);
        expect(result.endOffset).toBe(0);

        const isBold = document.queryCommandState('bold');
        const isItalic = document.queryCommandState('italic');
        expect(isBold).toBe(true);
        expect(isItalic).toBe(false);
    });
});
