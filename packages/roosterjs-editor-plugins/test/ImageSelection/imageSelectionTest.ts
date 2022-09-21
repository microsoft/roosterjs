import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, SelectionRangeTypes } from 'roosterjs-editor-types';
import { IEditor } from 'roosterjs-editor-types';
import { ImageSelection } from '../../lib/ImageSelection';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

describe('ImageSelectionPlugin |', () => {
    let editor: IEditor;
    let id = 'imageSelectionContainerId';
    let imageId = 'imageSelectionId';
    let imageSelection: ImageSelection;
    let editorIsFeatureEnabled: any;

    beforeEach(() => {
        let node = document.createElement('div');
        node.id = id;
        document.body.insertBefore(node, document.body.childNodes[0]);
        imageSelection = new ImageSelection();

        let options: EditorOptions = {
            plugins: [imageSelection],
            defaultFormat: {
                fontFamily: 'Calibri,Arial,Helvetica,sans-serif',
                fontSize: '11pt',
                textColor: '#000000',
            },
            corePluginOverride: {},
        };

        editor = new Editor(node as HTMLDivElement, options);

        editor.runAsync = callback => {
            callback(editor);
            return null;
        };
        editorIsFeatureEnabled = spyOn(editor, 'isFeatureEnabled');
    });

    it('should be triggered in mouse down', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        simulateMouseEvent(target!);
        editor.focus();

        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
        expect(selection.areAllCollapsed).toBe(false);
    });

    it('should be triggered in shadopw', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);

        editor.startShadowEdit();

        let selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
        expect(selection.areAllCollapsed).toBe(false);

        editor.stopShadowEdit();

        selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
        expect(selection.areAllCollapsed).toBe(false);
    });

    afterEach(() => {
        editor.dispose();
        editor = null;
        const div = document.getElementById(id);
        div.parentNode.removeChild(div);
    });

    function simulateMouseEvent(target: HTMLElement) {
        const rect = target.getBoundingClientRect();
        var event = new MouseEvent('mousedown', {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left,
            clientY: rect.top,
            shiftKey: false,
        });
        target.dispatchEvent(event);
    }
});
