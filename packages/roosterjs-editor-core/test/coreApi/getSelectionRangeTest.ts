import createEditorCore from './createMockEditorCore';
import { getSelectionRange } from '../../lib/coreApi/getSelectionRange';
import { selectNode } from '../TestHelper';

describe('getSelectionRange', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('do not use cache, focus is not in editor', () => {
        const core = createEditorCore(div, {});
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        const range = getSelectionRange(core, false);
        expect(range).toBeNull();
        document.body.removeChild(input);
    });

    it('do not use cache, focus is in editor', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';
        div.innerHTML = '<div>test</div>';
        selectNode(div.firstChild);

        const range = getSelectionRange(core, false);
        expect(range.startContainer).toBe(div);
        expect(range.endContainer).toBe(div);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(1);
    });

    it('use cache, focus is not in editor', () => {
        const core = createEditorCore(div, {});
        const cachedRange = document.createRange();
        core.domEvent = {
            selectionRange: cachedRange,
            isInIME: false,
            scrollContainer: null,
            stopPrintableKeyboardEventPropagation: false,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        };
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        const range = getSelectionRange(core, true);
        expect(range).toBe(cachedRange);
        document.body.removeChild(input);
    });

    it('use cache, focus is in editor', () => {
        const core = createEditorCore(div, {});
        div.contentEditable = 'true';
        div.innerHTML = '<div>test</div>';
        div.focus();
        selectNode(div.firstChild);

        const range = getSelectionRange(core, true);
        expect(range.startContainer).toBe(div);
        expect(range.endContainer).toBe(div);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(1);
    });
});
