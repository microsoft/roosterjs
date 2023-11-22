import * as TestHelper from '../TestHelper';
import { AutoFormat } from '../../lib/AutoFormat';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

describe('AutoHyphen |', () => {
    let editor: IEditor;
    const TEST_ID = 'autoHyphenTest';
    let plugin: EditorPlugin;
    let editorSearchCursorSpy: any;
    beforeEach(() => {
        plugin = new AutoFormat();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
        editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
    });

    afterEach(() => {
        editor.dispose();
    });

    const keyDown = (keysTyped: string): PluginEvent => {
        return {
            eventType: PluginEventType.KeyPress,
            rawEvent: <KeyboardEvent>{
                key: keysTyped,
            },
        };
    };

    function runTestShouldHandleAutoHyphen(keysTyped: string[], expectedResult: string) {
        const divId = 'testDiv';

        editor.setContent(
            `<div id=${divId}>${keysTyped[0]}</div><!--{"start":[0,0,1],"end":[0,0,1]}-->`,
            false
        );

        plugin?.onPluginEvent(keyDown(keysTyped[0]));

        editor.setContent(
            `<div id=${divId}>${
                keysTyped[0] + keysTyped[1]
            }</div><!--{"start":[0,0,2],"end":[0,0,2]}-->`,
            false
        );

        plugin?.onPluginEvent(keyDown(keysTyped[1]));

        editor.setContent(
            `<div id=${divId}>${
                keysTyped[0] + keysTyped[1] + keysTyped[2]
            }</div><!--{"start":[0,0,3],"end":[0,0,3]}-->`,
            false
        );

        plugin?.onPluginEvent(keyDown(keysTyped[2]));

        editor.setContent(
            `<div id=${divId}>${
                keysTyped[0] + keysTyped[1] + keysTyped[2] + keysTyped[3]
            }</div><!--{"start":[0,0,4],"end":[0,0,4]}-->`,
            false
        );

        plugin?.onPluginEvent(keyDown(keysTyped[3]));
        if (keysTyped[4]) {
            editor.setContent(
                `<div id=${divId}>${
                    keysTyped[0] + keysTyped[1] + keysTyped[2] + keysTyped[3] + keysTyped[4]
                }</div><!--{"start":[0,0,5],"end":[0,0,5]}-->`,
                false
            );

            plugin?.onPluginEvent(keyDown(keysTyped[4]));
        }

        if (keysTyped[5]) {
            editor.setContent(
                `<div id=${divId}>${
                    keysTyped[0] +
                    keysTyped[1] +
                    keysTyped[2] +
                    keysTyped[3] +
                    keysTyped[4] +
                    keysTyped[5]
                }</div><!--{"start":[0,0,6],"end":[0,0,6]}-->`,
                false
            );

            plugin?.onPluginEvent(keyDown(keysTyped[5]));
        }

        if (keysTyped[6]) {
            plugin?.onPluginEvent(keyDown(keysTyped[6]));
        }

        expect(editor.getContent()).toBe(expectedResult);
    }

    it('Should not format| - ', () => {
        runTestShouldHandleAutoHyphen(['t', '-', '-', '-', ' '], '<div id="testDiv">t--- </div>');
    });

    it('Should not format | " "', () => {
        runTestShouldHandleAutoHyphen(['t', '-', '-', ' '], '<div id="testDiv">t-- </div>');
    });

    it('Should not format | ! ', () => {
        runTestShouldHandleAutoHyphen(['t', '-', '-', '!', ' '], '<div id="testDiv">t--! </div>');
    });
});
