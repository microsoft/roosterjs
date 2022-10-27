import * as TestHelper from '../TestHelper';
import { ChangeSource, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';
import { PickerPlugin } from '../../lib/Picker';

const BACKSPACE_CHAR_CODE = 'Backspace';
const ESC_CHAR_CODE = 'Escape';

const dataProvider = {
    onInitalize: (
        insertNodeCallback: (nodeToInsert: HTMLElement) => void,
        setIsSuggestingCallback: (isSuggesting: boolean) => void,
        editor?: IEditor
    ) => {},
    onDispose: () => {
        return;
    },

    onIsSuggestingChanged: (isSuggesting: boolean) => {
        return;
    },

    queryStringUpdated: (queryString: string, isExactMatch: boolean) => {
        return;
    },

    onRemove: (nodeRemoved: Node, isBackwards: boolean) => {
        return document.createTextNode('');
    },

    onScroll: (scrollContainer: HTMLElement) => {
        return;
    },

    onContentChanged: (elementIds: string[]) => {
        return;
    },
};

const pickerOptions = {
    elementIdPrefix: 'picker_test',
    changeSource: ChangeSource.SetContent,
    triggerCharacter: ')',
};

describe('PickerPlugin |', () => {
    let editor: IEditor;
    const TEST_ID = 'pickerTest';
    const plugin = new PickerPlugin(dataProvider, pickerOptions);
    let spyOnQueryStringUpdated: any;
    let spyOnIsSuggestingChanged: any;
    let spyOnScroll: any;
    let spyOnContentChange: any;
    let spyOnInitialize: any;
    let spyOnDispose: any;
    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        spyOnQueryStringUpdated = spyOn(plugin.dataProvider, 'queryStringUpdated');
        spyOnIsSuggestingChanged = spyOn(plugin.dataProvider, 'onIsSuggestingChanged');
        spyOnScroll = spyOn(plugin.dataProvider, 'onScroll');
        spyOnContentChange = spyOn(plugin.dataProvider, 'onContentChanged');
        spyOnInitialize = spyOn(plugin.dataProvider, 'onInitalize');
        spyOnDispose = spyOn(plugin.dataProvider, 'onDispose');
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

    const scroll = (): PluginEvent => {
        return {
            eventType: PluginEventType.Scroll,
            rawEvent: <Event>{},
            scrollContainer: undefined,
        };
    };

    const contentChanged = (): PluginEvent => {
        return {
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.SetContent,
        };
    };

    function runTestKeyDown(content: string, keyTyped: string) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(')'));
        plugin.onPluginEvent(keyDown(keyTyped));
        expect(spyOnIsSuggestingChanged).toHaveBeenCalled();
        expect(spyOnIsSuggestingChanged).toHaveBeenCalledWith(false);
    }

    function runTestMouseUp(content: string) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(')'));
        plugin.onPluginEvent(mouseUp());
        expect(spyOnIsSuggestingChanged).toHaveBeenCalled();
        expect(spyOnIsSuggestingChanged).toHaveBeenCalledWith(false);
    }

    function runTestScroll() {
        const scrollEvent = scroll();
        plugin.onPluginEvent(scrollEvent);
        expect(spyOnScroll).toHaveBeenCalled();
        expect(spyOnScroll).toHaveBeenCalledWith(spyOnScroll.scrollContainer);
    }

    function runTestKeyUp(content: string, keyTyped: string, shouldSuggest: boolean) {
        editor.setContent(content);
        plugin.onPluginEvent(keyUp(keyTyped));
        expect(spyOnQueryStringUpdated).toHaveBeenCalled();
        expect(spyOnIsSuggestingChanged).toHaveBeenCalled();
        expect(spyOnIsSuggestingChanged).toHaveBeenCalledWith(shouldSuggest);
    }

    function runTestContentChange() {
        plugin.onPluginEvent(contentChanged());
        expect(spyOnContentChange).toHaveBeenCalled();
        expect(spyOnContentChange).toHaveBeenCalledWith([]);
    }

    it('should show picker', () => {
        runTestKeyUp('<div>) </div><!--{"start":[0,0,2],"end":[0,0,2]}-->', ')', true);
    });

    it('should hide picker | ESC', () => {
        runTestKeyDown('<div>)</div><!--{"start":[0,0,1],"end":[0,0,1]}-->', ESC_CHAR_CODE);
    });

    it('should hide picker | backspace', () => {
        runTestKeyDown('<div>)</div><!--{"start":[0,0,1],"end":[0,0,1]}-->', BACKSPACE_CHAR_CODE);
    });

    it('should hide picker | mouseEvent', () => {
        runTestMouseUp('<div>)</div><!--{"start":[0,0,1],"end":[0,0,1]}-->');
    });

    it('should execute scroll function', () => {
        runTestScroll();
    });

    it('should execute onContentChange function', () => {
        runTestContentChange();
    });

    it('should execute initialize function', () => {
        plugin.initialize(editor);
        expect(spyOnInitialize).toHaveBeenCalled();
    });

    it('should execute dispose function', () => {
        plugin.dispose();
        expect(spyOnDispose).toHaveBeenCalled();
    });
});
