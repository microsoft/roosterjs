import createEditorCore from '../../editor/createEditorCore';
import EditorCore from '../../interfaces/EditorCore';
import hasFocus from '../../coreAPI/hasFocus';
import { createRange } from 'roosterjs-editor-dom';

describe('hasFocus', () => {
    let div: HTMLDivElement;
    let core: EditorCore;
    beforeEach(() => {
        div = document.createElement('div');
        div.contentEditable = 'true';
        document.body.appendChild(div);
        core = createEditorCore(div, {});
        (<any>core).plugins = core.plugins.filter(
            plugin => plugin != core.corePlugins.undo && plugin != core.corePlugins.edit
        );
    });

    afterEach(() => {
        document.body.removeChild(div);
        core = null;
        div = null;
    });

    it('Check editor has focus after set focus', () => {
        core.api.focus(core);
        let result = hasFocus(core);
        expect(result).toBe(true);
    });

    it('Check editor does not have focus after set focus away', () => {
        let button = document.createElement('button');
        document.body.appendChild(button);
        core.api.focus(core);
        expect(hasFocus(core)).toBe(true);

        button.focus();
        expect(hasFocus(core)).toBe(false);

        document.body.removeChild(button);
    });

    it('Check editor has focus after select', () => {
        core.contentDiv.innerHTML = '<span>test</span>';
        expect(hasFocus(core)).toBe(false);

        let span = core.contentDiv.querySelector('span');
        core.api.selectRange(core, createRange(span.firstChild, 1));
        expect(hasFocus(core)).toBe(true);
    });
});
