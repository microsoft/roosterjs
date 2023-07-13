import Editor from '../../lib/editor/Editor';
import ImageSelection from '../../lib/corePlugins/ImageSelection';
import {
    IEditor,
    EditorOptions,
    SelectionRangeTypes,
    ImageSelectionRange,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
export * from 'roosterjs-editor-dom/test/DomTestHelper';

const Escape = 'Escape';
const Space = ' ';
const Delete = 'Delete';

describe('ImageSelectionPlugin |', () => {
    let editor: IEditor;
    let id = 'imageSelectionContainerId';
    let imageId = 'imageSelectionId';
    let imageId2 = 'imageSelectionId2';
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

    it('should be triggered in mouse up left click', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        simulateMouseEvent('mousedown', target!, 0);
        simulateMouseEvent('mouseup', target!, 0);
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
        imageSelection.onPluginEvent(keyUp(Escape));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(true);
    });

    it('should handle a DELETE KEY in a image', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const range = document.createRange();
        range.selectNode(target!);
        imageSelection.onPluginEvent(keyDown(Delete));
        imageSelection.onPluginEvent(keyUp(Delete));
        expect(editor.getContent()).toBe('');
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
        imageSelection.onPluginEvent(keyUp(Space));
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.Normal);
        expect(selection.areAllCollapsed).toBe(false);
    });

    it('should handle contextMenu', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        const contextMenuEvent = contextMenu(target!);
        imageSelection.onPluginEvent(contextMenuEvent);
        const selection = editor.getSelectionRangeEx();
        expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);
        expect(selection.areAllCollapsed).toBe(false);
    });

    it('should change image selection contextMenu', () => {
        editor.setContent(`<img id=${imageId}></img><img id=${imageId2}></img>`);
        const target = document.getElementById(imageId);
        const secondTarget = document.getElementById(imageId2);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(secondTarget);
        const contextMenuEvent = contextMenu(target!);
        imageSelection.onPluginEvent(contextMenuEvent);
        const selection = editor.getSelectionRangeEx() as ImageSelectionRange;
        expect(selection.type).toBe(SelectionRangeTypes.ImageSelection);

        expect(selection.image.id).toBe(imageId);
    });

    it('should not change image selection contextMenu', () => {
        editor.setContent(`<img id=${imageId}></img>`);
        const target = document.getElementById(imageId);
        editorIsFeatureEnabled.and.returnValue(true);
        editor.focus();
        editor.select(target);
        const contextMenuEvent = contextMenu(target!);
        imageSelection.onPluginEvent(contextMenuEvent);
        spyOn(editor, 'select');
        expect(editor.select).not.toHaveBeenCalled();
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

    const keyUp = (key: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyUp,
            rawEvent: <KeyboardEvent>{
                key: key,
                preventDefault: () => {},
                stopPropagation: () => {},
            },
        };
    };

    const contextMenu = (target: HTMLElement): PluginEvent => {
        return {
            eventType: PluginEventType.ContextMenu,
            rawEvent: <any>{
                target: target,
            },
            items: [],
        };
    };

    function simulateMouseEvent(mouseEvent: string, target: HTMLElement, keyNumber: number) {
        const rect = target.getBoundingClientRect();
        var event = new MouseEvent(mouseEvent, {
            view: window,
            bubbles: true,
            cancelable: true,
            clientX: rect.left,
            clientY: rect.top,
            shiftKey: false,
            button: keyNumber,
        });
        target.dispatchEvent(event);
    }
});
