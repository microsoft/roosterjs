import createEditorCore from './createMockEditorCore';
import { focus } from '../../lib/coreApi/focus';

describe('focus', () => {
    let div: HTMLDivElement;
    beforeEach(() => {
        div = document.createElement('div');
        div.contentEditable = 'true';
        document.body.appendChild(div);
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
    });

    it('focus', () => {
        const core = createEditorCore(div, {});
        core.domEvent = {
            selectionRange: document.createRange(),
            isInIME: false,
            scrollContainer: null,
            stopPrintableKeyboardEventPropagation: false,
            contextMenuProviders: [],
            tableSelectionRange: null,
            imageSelectionRange: null,
        };

        focus(core);

        expect(core.domEvent.selectionRange).toBeNull();
        expect(document.activeElement).toBe(div);
    });
});
