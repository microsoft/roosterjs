import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { Browser } from 'roosterjs-editor-dom';
import { TextFeatures } from '../../../lib/plugins/ContentEdit/features/textFeatures';
import {
    BuildInEditFeature,
    ExperimentalFeatures,
    IEditor,
    Keys,
    PluginEventType,
    PluginKeyboardEvent,
} from 'roosterjs-editor-types';

describe('Text Features |', () => {
    let editor: IEditor;
    const TEST_ID = 'Test_ID';
    const TEST_ELEMENT_ID = 'test';

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID, null, [ExperimentalFeatures.TabKeyTextFeatures]);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    describe('Should handle event |', () => {
        function runShouldHandleTest(
            feature: BuildInEditFeature<PluginKeyboardEvent>,
            content: string,
            selectCallback: () => void,
            shouldHandleExpect: boolean
        ) {
            //Arrange
            const keyboardEvent: PluginKeyboardEvent = {
                eventType: PluginEventType.KeyDown,
                rawEvent: simulateKeyDownEvent(Keys.TAB),
            };
            editor.setContent(content);
            selectCallback();

            //Act
            const result = feature.shouldHandleEvent(keyboardEvent, editor, false);

            //Assert
            expect(!!result).toBe(shouldHandleExpect);
        }

        it('Should handle, text collapsed', () => {
            runShouldHandleTest(
                TextFeatures.indentWhenTabText,
                `<div id='${TEST_ELEMENT_ID}'></div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element, 0);
                    editor.select(range);
                },
                true
            );
        });

        it('Should handle, range not collapsed', () => {
            runShouldHandleTest(
                TextFeatures.indentWhenTabText,
                `<div id='${TEST_ELEMENT_ID}'>Test</div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element, 0);
                    range.setEnd(element, 1);
                    editor.select(range);
                },
                true
            );
        });

        it('Should not handle, in a list', () => {
            runShouldHandleTest(
                TextFeatures.indentWhenTabText,
                `<div> <ol> <li id='${TEST_ELEMENT_ID}'>sad </li></ol> </div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element, 0);
                    editor.select(range);
                },
                false
            );
        });
    });

    describe('Handle event |', () => {
        function runHandleTest(
            feature: BuildInEditFeature<PluginKeyboardEvent>,
            content: string,
            selectCallback: () => void,
            contentExpected: string
        ) {
            //Arrange
            const keyboardEvent: PluginKeyboardEvent = {
                eventType: PluginEventType.KeyDown,
                rawEvent: simulateKeyDownEvent(Keys.TAB),
            };
            editor.setContent(content);
            selectCallback();

            //Act
            feature.handleEvent(keyboardEvent, editor);

            //Assert
            expect(editor.getContent()).toBe(contentExpected);
        }
        it('Handle event, text collapsed', () => {
            runHandleTest(
                TextFeatures.indentWhenTabText,
                `<div id='${TEST_ELEMENT_ID}'></div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element, 0);
                    editor.select(range);
                },
                '<div id="test"><span>      </span></div>'
            );
        });

        it('Should handle, range not collapsed and is selected from start to end', () => {
            runHandleTest(
                TextFeatures.indentWhenTabText,
                `<div id='${TEST_ELEMENT_ID}'>Test</div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element, 0);
                    range.setEnd(element, 1);
                    editor.select(range);
                },
                '<blockquote style="margin-top:0;margin-bottom:0"><div id="test">Test</div></blockquote>'
            );
        });

        it('Should handle, range not collapsed and is not selected from start to end', () => {
            debugger;
            runHandleTest(
                TextFeatures.indentWhenTabText,
                `<div><span id='${TEST_ELEMENT_ID}'>Test</span></div>`,
                () => {
                    const element = editor.getDocument().getElementById(TEST_ELEMENT_ID);
                    const range = new Range();
                    range.setStart(element.firstChild, 1);
                    range.setEnd(element.firstChild, 2);
                    editor.select(range);
                },
                '<div><span id="test">T<span>     </span>st</span></div>'
            );
        });
    });
});

function simulateKeyDownEvent(
    whichInput: number,
    shiftKey: boolean = false,
    ctrlKey: boolean = false
) {
    const evt = new KeyboardEvent('keydown', {
        shiftKey,
        altKey: false,
        ctrlKey,
        cancelable: true,
        which: whichInput,
    });

    if (!Browser.isFirefox) {
        //Chromium hack to add which to the event as there is a bug in Webkit
        //https://stackoverflow.com/questions/10455626/keydown-simulation-in-chrome-fires-normally-but-not-the-correct-key/10520017#10520017
        Object.defineProperty(evt, 'which', {
            get: function () {
                return whichInput;
            },
        });
    }
    return evt;
}
