import * as TestHelper from '../TestHelper';
import { PickerPlugin } from '../../lib/Picker';
import { Position, PositionContentSearcher } from 'roosterjs-editor-dom';
import {
    IEditor,
    PluginEvent,
    PluginEventType,
    PickerDataProvider,
    PickerPluginOptions,
    ChangeSource,
} from 'roosterjs-editor-types';

describe('PickerTest |', () => {
    let editor: IEditor;
    const TEST_ID = 'PickerTest';
    const root = document.createElement('div');
    root.id = 'test';
    root.innerText = '-';
    document.body.appendChild(root);
    const options: PickerPluginOptions = {
        elementIdPrefix: 'test',
        changeSource: ChangeSource.SetContent,
        triggerCharacter: '-',
    };
    const dataProvider: PickerDataProvider = {
        onInitalize: (
            insertNodeCallback: (nodeToInsert: HTMLElement) => void,
            setIsSuggestingCallback: (isSuggesting: boolean) => void,
            editor?: IEditor
        ) => {
            editor.focus();
            const editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
            const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
            spyOn(mockedPosition, 'getSubStringBefore').and.returnValue('-');
            editorSearchCursorSpy.and.returnValue(mockedPosition);
            insertNodeCallback(root);
            setIsSuggestingCallback(true);
            return;
        },
        onDispose: () => {
            return;
        },
        onIsSuggestingChanged: (isSuggesting: boolean) => {
            return;
        },
        queryStringUpdated: (queryString: string, isExactMatch: boolean) => {
            return;
        },
        onContentChanged: (elementIds: string[]) => {
            return;
        },
        onRemove: (nodeRemoved: Node, isBackwards: boolean) => {
            const node = document.createTextNode('');
            return node;
        },
    };

    let plugin: PickerPlugin;
    beforeEach(() => {
        plugin = new PickerPlugin(dataProvider, options);
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        editor.focus();
        const editorQueryElements = spyOn(editor, 'queryElements');
        editorQueryElements.and.returnValue([root]);
        plugin.initialize(editor);
    });

    afterEach(() => {
        document.body.removeChild(root);
        editor.dispose();
    });

    it('PickerPlugin | ContentEvent', () => {
        const eventChange: PluginEvent = {
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.SetContent,
        };
        plugin.onPluginEvent(eventChange);
        spyOn(plugin.dataProvider, 'onContentChanged');
        expect(plugin.dataProvider.onContentChanged).toHaveBeenCalled();
    });

    function keyDownTest(key: string) {
        const eventChange: PluginEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: <KeyboardEvent>{
                key: key,
                preventDefault: () => {
                    return;
                },
                stopImmediatePropagation: () => {
                    return;
                },
            },
        };

        plugin.onPluginEvent(eventChange);
        spyOn(eventChange.rawEvent, 'preventDefault');
        spyOn(eventChange.rawEvent, 'stopImmediatePropagation');
        expect(eventChange.rawEvent.preventDefault).toHaveBeenCalled();
        expect(eventChange.rawEvent.stopImmediatePropagation).toHaveBeenCalled();
    }

    it('PickerPlugin | KeyDownESC', () => {
        keyDownTest('Esc');
    });
});
