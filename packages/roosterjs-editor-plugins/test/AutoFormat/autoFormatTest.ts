import * as TestHelper from '../TestHelper';
import { AutoFormat } from '../../lib/AutoFormat';
import { EditorPlugin, IEditor, PluginEvent, PluginEventType } from 'roosterjs-editor-types';

describe('AutoHyphen |', () => {
    let editor: IEditor;
    const TEST_ID = 'autoHyphenTest';
    let plugin: EditorPlugin;
    beforeEach(() => {
        plugin = new AutoFormat();
        editor = TestHelper.initEditor(TEST_ID, [plugin]);
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

    function runTestShouldHandleAutoHyphen(
        content: string,
        keysTyped: string[],
        expectedResult: string
    ) {
        editor.setContent(content);
        plugin.onPluginEvent(keyDown(keysTyped[0]));
        plugin.onPluginEvent(keyDown(keysTyped[1]));
        plugin.onPluginEvent(keyDown(keysTyped[2]));
        plugin.onPluginEvent(keyDown(keysTyped[3]));
        expect(editor.getContent()).toBe(expectedResult);
    }

    it('Should format ', () => {
        runTestShouldHandleAutoHyphen(
            '<div>t--</div><!--{"start":[0,0,4],"end":[0,0,4]}-->',
            ['t', '-', '-', 'b'],
            '<div>t—</div>'
        );
    });

    it('Should not format| - ', () => {
        runTestShouldHandleAutoHyphen(
            '<div>t—-</div><!--{"start":[0,0,3],"end":[0,0,3]}-->',
            ['t', '-', '-', '-'],
            '<div>t—-</div>'
        );
    });

    it('Should not format | " "', () => {
        runTestShouldHandleAutoHyphen(
            '<div>t—-</div><!--{"start":[0,0,3],"end":[0,0,3]}-->',
            ['t', '-', '-', ' '],
            '<div>t—-</div>'
        );
    });

    it('Should not format | ! ', () => {
        runTestShouldHandleAutoHyphen(
            '<div>t—-</div><!--{"start":[0,0,3],"end":[0,0,3]}-->',
            ['t', '-', '-', '!'],
            '<div>t—-</div>'
        );
    });
});
