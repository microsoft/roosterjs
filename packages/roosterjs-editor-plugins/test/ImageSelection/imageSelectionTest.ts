import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';
import { ImageSelection } from '../../lib/ImageSelection';
import {
    EditorOptions,
    SelectionRangeTypes,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

const Escape = 'Escape';
const Space = ' ';
const Home = 'Home';
const PageDown = 'PageDown';
const PageUp = 'PageUp';
const End = 'End';

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

    afterEach(() => {
        editor.dispose();
        editor = null;
        const div = document.getElementById(id);
        div.parentNode.removeChild(div);
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

    it('should be triggered in shadow Edit', () => {
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

    it('should handle a ESCAPE KEY in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(Escape));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle a HOME KEY in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(Home));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle a PAGE DOWN in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(PageDown));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle a End in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(End));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle a PageUp in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(PageUp));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle any key in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(Space));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(false);
    });

    const keyDown = (key: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                key: key,
                preventDefault: () => {},
                stopPropagation: () => {},
            },
        };
    };

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
