import * as TestHelper from '../TestHelper';
import { IEditor, PickerDataProvider, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { PickerPlugin } from '../../lib/Picker';

const BACKSPACE_CHAR_CODE = 'Backspace';

type InsertNodeCallback = (nodeToInsert: HTMLElement) => void;
export default class SampleColorPickerPluginDataProvider implements PickerDataProvider {
    /**
     * For inserting a node into hte
     */
    private mountPoint: HTMLElement | null;
    private editor: IEditor;

    // Function called when the plugin is initialized to register two callbacks with the data provider and a reference to the Editor.
    // The first is called in order to "commit" a new element to the editor body that isn't handled automatically by the editor plugin.
    // The second sets the isSuggesting value for situations where the UX needs to manipulate the suggesting state that's otherwise plugin managed.
    onInitalize(
        insertNodeCallback: InsertNodeCallback,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor: IEditor
    ): void {
        this.editor = editor;

        const doc = this.editor.getDocument();
        this.mountPoint = doc.createElement('section');
        if (this.mountPoint) {
            this.mountPoint.id = pickerOptions.elementIdPrefix;
        }
        doc.body.appendChild(this.mountPoint);
    }

    // Function called when the plugin is disposed for the data provider to do any cleanup.
    onDispose(): void {
        if (this.mountPoint) {
            const parent = this.mountPoint.parentElement;
            parent?.removeChild(this.mountPoint);
        }
        this.mountPoint = null;
    }

    // Function called when the picker changes suggesting state (e.g. when your dialog opens)
    onIsSuggestingChanged(isSuggesting: boolean) {
        if (isSuggesting) {
            const doc = this.editor.getDocument();
            this.mountPoint = doc.createElement('section');
            if (this.mountPoint) {
                this.mountPoint.id = pickerOptions.elementIdPrefix;
            }
            doc.body.appendChild(this.mountPoint);
        } else {
            if (this.mountPoint) {
                const parent = this.mountPoint.parentElement;
                parent?.removeChild(this.mountPoint);
            }
        }
    }

    // Function called when the query string (text after the trigger symbol) is updated.
    queryStringUpdated(queryString: string) {
        return;
    }

    // Function that is called when a delete command is issued.
    // Returns the intended replacement node (if partial delete) or null (if full delete)
    onRemove(nodeRemoved: Node, isBackwards: boolean): Node | null {
        return null;
    }
}

const pickerOptions = {
    elementIdPrefix: 'samplePicker-',
    changeSource: 'SAMPLE_COLOR_PICKER',
    triggerCharacter: ':',
    isHorizontal: true,
};
describe('PickerPlugin |', () => {
    let editor: IEditor;
    const dataProvider = new SampleColorPickerPluginDataProvider();
    const TEST_ID = 'pickerTest';
    const plugin = new PickerPlugin(dataProvider, pickerOptions);
    let spyOnSetSuggestion: any;
    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        plugin.initialize(editor);
        spyOnSetSuggestion = spyOn(dataProvider, 'onIsSuggestingChanged');
    });

    afterEach(() => {
        editor.dispose();
    });

    const keyDown = (keysTyped: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                key: keysTyped,
                preventDefault: () => {
                    return;
                },
                stopImmediatePropagation: () => {
                    return;
                },
            },
        };
    };

    const keyUp = (keysTyped: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyUp,
            rawEvent: <KeyboardEvent>{
                key: keysTyped,
            },
        };
    };

    const mouseUp = (): PluginEvent => {
        return {
            eventType: PluginEventType.MouseUp,
            rawEvent: <MouseEvent>{},
        };
    };

    function runTestKeyDown(content: string, keyTyped: string) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(':'));
        plugin.onPluginEvent(keyDown(keyTyped));
        expect(spyOnSetSuggestion).toHaveBeenCalled();
        expect(spyOnSetSuggestion).toHaveBeenCalledWith(false);
    }

    function runTestMouseUp(content: string) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(':'));
        plugin.onPluginEvent(mouseUp());
        expect(spyOnSetSuggestion).toHaveBeenCalled();
        expect(spyOnSetSuggestion).toHaveBeenCalledWith(false);
    }

    function runTestKeyUp(content: string, keyTyped: string) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(keyTyped));
        const mountPoint = editor.getDocument().getElementById(pickerOptions.elementIdPrefix);
        expect(mountPoint).toBeTruthy();
    }

    it('key down | backspace ', () => {
        runTestKeyDown('<div>: </div><!--{"start":[0,0,2],"end":[0,0,2]}-->', BACKSPACE_CHAR_CODE);
    });

    it('key up ', () => {
        runTestKeyUp('<div>:</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', ':');
    });

    it('mouse up', () => {
        runTestMouseUp('<div>:</div><!--{"start":[0,0,2],"end":[0,0,2]}-->');
    });
});
