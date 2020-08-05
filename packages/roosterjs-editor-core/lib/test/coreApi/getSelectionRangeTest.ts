import createEditorCore from '../../editor/createEditorCore';
import { getSelectionRange } from '../../coreAPI/getSelectionRange';
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
        core.domEvent.value = {
            selectionRange: cachedRange,
            isInIME: false,
            pendableFormatState: null,
            pendableFormatPosition: null,
            scrollContainer: null,
            stopPrintableKeyboardEventPropagation: false,
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
        selectNode(div.firstChild);

        const range = getSelectionRange(core, true);
        expect(range.startContainer).toBe(div);
        expect(range.endContainer).toBe(div);
        expect(range.startOffset).toBe(0);
        expect(range.endOffset).toBe(1);
    });
});
