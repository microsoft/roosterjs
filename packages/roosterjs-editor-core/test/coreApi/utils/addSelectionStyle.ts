import addSelectionStyle from '../../../lib/coreApi/utils/addSelectionStyle';
import createEditorCore from '../createMockEditorCore';
import { EditorCore } from 'roosterjs-editor-types';

describe('addSelectionStyle', () => {
    let div: HTMLDivElement;
    let core: EditorCore | null;
    beforeEach(() => {
        div = document.createElement('div');
        document.body.appendChild(div);
        core = createEditorCore(div!, {});
    });

    afterEach(() => {
        document.body.removeChild(div);
        div = null;
        core = null;
    });

    it('should add an style ', () => {
        core.contentDiv.id = 'contentTest';
        const css =
            '#' +
            'contentTest' +
            ' #' +
            'test' +
            ' { margin: -2px; border: 2px solid' +
            '#DB626C' +
            ' !important; }';
        addSelectionStyle(core, css, 'test');
        const styleTag = document.getElementById('testcontentTest');
        expect(styleTag?.tagName).toBe('STYLE');
    });
});
