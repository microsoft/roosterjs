import { IEditor, PluginEventType, PluginKeyboardEvent, Keys } from 'roosterjs-editor-types';
import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { CodeFeatures } from '../../../lib/plugins/ContentEdit/features/codeFeatures';

const TEST_ELEMENT_ID = 'test_codeFeatures';
const TEST_EDITOR_ID = 'testEditor_codeFeatures';

describe('CodeFeatures', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_EDITOR_ID);
    });

    afterEach(() => {
        document.getElementById(TEST_EDITOR_ID)?.remove();
        editor.dispose();
        editor = null;
    });

    function runShouldHandleEvent(
        shouldHandleEventFunc: Function,
        content: string,
        whichKey: number,
        shouldHandle: boolean
    ) {
        editor.setContent(content);
        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
        const range = new Range();
        range.setStart(element, 0);
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            rawEvent: new KeyboardEvent('keydown', {
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                which: whichKey,
            }),
            eventType: PluginEventType.KeyDown,
        };
        expect(!!shouldHandleEventFunc(keyboardEvent, editor, false)).toBe(shouldHandle);
    }

    function runHandleEvent(
        handleEventFunc: Function,
        content: string,
        whichKey: number,
        expectedContent: string
    ) {
        editor.setContent(content);
        const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
        const range = new Range();
        range.setStart(element, 0);
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            rawEvent: new KeyboardEvent('keydown', {
                shiftKey: false,
                altKey: false,
                ctrlKey: false,
                which: whichKey,
            }),
            eventType: PluginEventType.KeyDown,
        };
        handleEventFunc(keyboardEvent, editor, false);
        expect(editor.getContent()).toBe(expectedContent);
    }

    describe('RemoveCodeWhenEnterOnEmptyLine - shouldHandle', () => {
        const { shouldHandleEvent } = CodeFeatures.removeCodeWhenEnterOnEmptyLine;

        it('should handle when enter is pressed and cursor is in empty code block', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'><br></span></div></code></pre>`,
                Keys.ENTER,
                true
            );
        });

        it('should not handle when enter is pressed and cursor is in an empty block which is not code', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<div><span id='${TEST_ELEMENT_ID}'><br></span></div>`,
                Keys.ENTER,
                false
            );
        });

        it('should not handle when enter is pressed and cursor is in a non-empty code block', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'>test</span></div></code></pre>`,
                Keys.ENTER,
                false
            );
        });
    });

    describe('RemoveCodeWhenEnterOnEmptyLine - handleEvent', () => {
        const { handleEvent } = CodeFeatures.removeCodeWhenEnterOnEmptyLine;

        it('should remove code block when enter is pressed and cursor is in empty code block', () => {
            runHandleEvent(
                handleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'><br></span></div></code></pre>`,
                Keys.ENTER,
                `<div><span id="${TEST_ELEMENT_ID}"><br></span></div>`
            );
        });

        it('should not disturb other lines when selecting an empty line between two non-empty lines', () => {
            runHandleEvent(
                handleEvent,
                `<pre><code><div><span>hello</span></div><div><span id='${TEST_ELEMENT_ID}'><br></span></div><div><span>hello</span></div></code></pre>`,
                Keys.ENTER,
                `<pre><code><div><span>hello</span></div></code></pre><div><span id="${TEST_ELEMENT_ID}"><br></span></div><pre><code><div><span>hello</span></div></code></pre>`
            );
        });
    });

    describe('RemoveCodeWhenBackspaceOnEmptyLine - shouldHandle', () => {
        const { shouldHandleEvent } = CodeFeatures.removeCodeWhenBackspaceOnEmptyFirstLine;

        it('should handle when backspace is pressed and cursor is in empty code block', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'><br></span></div></code></pre>`,
                Keys.BACKSPACE,
                true
            );
        });

        it('should not handle when backspace is pressed and cursor is in an empty block which is not code', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<div><span id='${TEST_ELEMENT_ID}'><br></span></div>`,
                Keys.BACKSPACE,
                false
            );
        });

        it('should not handle when backspace is pressed and cursor is in a non-empty code block', () => {
            runShouldHandleEvent(
                shouldHandleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'>test</span></div></code></pre>`,
                Keys.BACKSPACE,
                false
            );
        });
    });

    describe('RemoveCodeWhenBackspaceOnEmptyLine - handleEvent', () => {
        const { handleEvent } = CodeFeatures.removeCodeWhenBackspaceOnEmptyFirstLine;

        it('should remove code block when backspace is pressed and cursor is in empty code block', () => {
            runHandleEvent(
                handleEvent,
                `<pre><code><div><span id='${TEST_ELEMENT_ID}'><br></span></div></code></pre>`,
                Keys.BACKSPACE,
                `<div><span id="${TEST_ELEMENT_ID}"><br></span></div>`
            );
        });
    });
});
