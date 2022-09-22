import { Editor } from 'roosterjs-editor-core';
import { IEditor } from 'roosterjs-editor-types';
import { ImageSelection } from '../../lib/ImageSelection';
import {
    EditorOptions,
    SelectionRangeTypes,
    PluginEvent,
    PluginEventType,
    Keys,
} from 'roosterjs-editor-types';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

const SHIFT_KEYCODE = 16;
const CTRL_KEYCODE = 17;
const ALT_KEYCODE = 18;

describe('ImageSelectionPlugin |', () => {
    let editor: IEditor;
    let id = 'imageSelectionContainerId';
    let imageId = 'imageSelectionId';
    let imageSelection: ImageSelection;
    let editorIsFeatureEnabled: any;
    let editorTriggerPluginEvent: any;

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
        editorTriggerPluginEvent = spyOn(editor, 'triggerPluginEvent');
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(Keys.ESCAPE));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
        expect(editorTriggerPluginEvent).toHaveBeenCalled();
        expect(editorTriggerPluginEvent).toHaveBeenCalledWith(PluginEventType.SelectionChanged, {
            selectionType: SelectionRangeTypes.Normal,
            selectedElement: undefined,
            keyboardKey: Keys.ESCAPE,
        });
    });

    it('should handle any SHIFT_KEY in a image', () => {
        editorTriggerPluginEvent = spyOn(editor, 'triggerPluginEvent');
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(SHIFT_KEYCODE));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(false);
        expect(editorTriggerPluginEvent).toHaveBeenCalledWith(PluginEventType.SelectionChanged, {
            selectionType: SelectionRangeTypes.Normal,
            selectedElement: undefined,
            keyboardKey: SHIFT_KEYCODE,
        });
    });

    it('should handle any CTRL_KEYCODE in a image', () => {
        editorTriggerPluginEvent = spyOn(editor, 'triggerPluginEvent');
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(CTRL_KEYCODE));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(false);
        expect(editorTriggerPluginEvent).toHaveBeenCalledWith(PluginEventType.SelectionChanged, {
            selectionType: SelectionRangeTypes.Normal,
            selectedElement: undefined,
            keyboardKey: CTRL_KEYCODE,
        });
    });

    it('should handle any ALT_KEYCODE in a image', () => {
        editorTriggerPluginEvent = spyOn(editor, 'triggerPluginEvent');
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(ALT_KEYCODE));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(false);
        expect(editorTriggerPluginEvent).toHaveBeenCalledWith(PluginEventType.SelectionChanged, {
            selectionType: SelectionRangeTypes.Normal,
            selectedElement: undefined,
            keyboardKey: ALT_KEYCODE,
        });
    });

    const keyDown = (keysTyped: number): PluginEvent => {
        return {
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                which: keysTyped,
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
