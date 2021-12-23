import { IEditor, PluginEventType, CustomReplacement } from 'roosterjs-editor-types';
import CustomReplacementPlugin from '../../lib/plugins/CustomReplace/CustomReplace';
import * as TestHelper from '../TestHelper';

const replacement: CustomReplacement[] = [
    {
        sourceString: ';)',
        replacementHTML: '🙂',
        matchSourceCaseSensitive: false,
    },
    { sourceString: 'CA', replacementHTML: '🙂', matchSourceCaseSensitive: true },
    {
        sourceString: ':(',
        replacementHTML: '🙂',
        matchSourceCaseSensitive: true,
        shouldReplace: () => false,
    },
    {
        sourceString: ':)',
        replacementHTML: '🙂',
        matchSourceCaseSensitive: true,
        shouldReplace: () => true,
    },
];

describe('CustomReplacePlugin', () => {
    let plugin: CustomReplacementPlugin;
    let editor: IEditor;
    let testID = 'EditorTest';

    beforeEach(() => {
        plugin = new CustomReplacementPlugin(replacement);
        editor = TestHelper.initEditor(testID, [plugin]);

        plugin.initialize(editor);
    });

    afterEach(() => {
        plugin.dispose();
    });

    function runTest(
        content: string,
        firstInput: string,
        secondInput: string,
        expectedResult: string
    ) {
        editor.setContent(content);
        editor.triggerPluginEvent(PluginEventType.Input, {
            rawEvent: <InputEvent>{ data: firstInput },
        });
        editor.triggerPluginEvent(PluginEventType.Input, {
            rawEvent: <InputEvent>{ data: secondInput },
        });
        editor.triggerContentChangedEvent();
        expect(editor.getContent()).toBe(expectedResult);
    }

    it('should replace', () => {
        runTest('<div>;)</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', ';', ')', '<div>🙂</div>');
    });

    it('case sensitive, should not replace', () => {
        runTest('<div>ca</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', 'c', 'a', '<div>ca</div>');
    });

    it('case sensitive, should replace', () => {
        runTest('<div>CA</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', 'C', 'A', '<div>🙂</div>');
    });

    it('should replace callback return false, should not replace', () => {
        runTest('<div>:(</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', ':', '(', '<div>:(</div>');
    });

    it('should replace callback return true, should replace', () => {
        runTest('<div>:)</div><!--{"start":[0,0,2],"end":[0,0,2]}-->', ':', ')', '<div>🙂</div>');
    });
});
