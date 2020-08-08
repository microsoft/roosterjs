import createEditorCore from './createMockEditorCore';
import { focus } from '../../lib/coreAPI/focus';

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
        core.domEvent.value = {
            selectionRange: document.createRange(),
            isInIME: false,
            scrollContainer: null,
            stopPrintableKeyboardEventPropagation: false,
        };

        focus(core);

        expect(core.domEvent.value.selectionRange).toBeNull();
        expect(document.activeElement).toBe(div);
    });
});
