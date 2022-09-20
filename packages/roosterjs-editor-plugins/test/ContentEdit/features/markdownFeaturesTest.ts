import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { MarkdownFeatures } from '../../../lib/plugins/ContentEdit/features/markdownFeatures';
import {
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    PositionType,
    //Keys,
} from 'roosterjs-editor-types';

describe('MarkdownFeatures | ', () => {
    let editor: IEditor;
    const TEST_ID = 'MarkDownFeatureTest';
    const TEST_ELEMENT_ID = 'MarkDownFeatureTestElementId';
    // const leftKey = Keys.LEFT;
    //const rightKey = Keys.RIGHT;

    beforeEach(done => {
        editor = TestHelper.initEditor(TEST_ID);
        editor.runAsync = (callback: (editor: IEditor) => void) => {
            callback(editor);
            return () => {};
        };
        done();
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    const keyboardEvent = (whichInput?: number) => {
        return new KeyboardEvent('keydown', {
            shiftKey: true,
            altKey: false,
            ctrlKey: false,
            cancelable: true,
            which: whichInput,
        });
    };

    /*function runShouldHandleEvent(
        content: string,
        shouldHandleExpect: boolean,
        rawKeyboardEvent: KeyboardEvent
        //selectContentCallback: (element: HTMLElement) => void,
        //rtl: boolean = false
    ) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };
        editor.setContent(content);
        const markdownBold = MarkdownFeatures.markdownBold;
        //const element = document.getElementById(TEST_ELEMENT_ID);

        editor.focus();
        //selectContentCallback(element);
        const result = markdownBold.shouldHandleEvent(keyboardPluginEvent, editor);

        expect(!!result).toBe(shouldHandleExpect);
    }*/

    /*function runHandleEvent(rawEvent: KeyboardEvent, expected: boolean) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawEvent,
        };
        const cycleCursorMove = CursorFeatures.noCycleCursorMove;
        cycleCursorMove.handleEvent(keyboardPluginEvent, editor);

        expect(keyboardPluginEvent.rawEvent.defaultPrevented).toBe(expected);
    }*/

    function runHandleEvent(rawEvent: KeyboardEvent, expected: boolean) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawEvent,
        };
        const markdownBold = MarkdownFeatures.markdownBold;
        markdownBold.handleEvent(keyboardPluginEvent, editor);

        const element = document.getElementById(TEST_ELEMENT_ID);
        const styledContent = element?.innerHTML;
        expect(styledContent).toBeTruthy;
    }

    describe('MarkdownBold | ', () => {
        const markdownBold = MarkdownFeatures.markdownBold;
        describe('Should Handle Event | ', () => {
            it('Should handle, is Markdown style bolding', () => {
                editor.setContent(`<div id="${TEST_ELEMENT_ID}">*abcd</div>`);
                editor.focus();
                const element = document.getElementById(TEST_ELEMENT_ID);
                editor.select(element, PositionType.End);
                //editor.select(element, PositionType.End, element, PositionType.Begin);
                //editor.select(document.getElementById('TEST_ELEMENT_ID')!, 0);
                //
                const keyboardPluginEvent: PluginKeyboardEvent = {
                    eventType: PluginEventType.KeyDown,
                    rawEvent: keyboardEvent(Number('*')),
                };
                const shouldHandleEvent = markdownBold.shouldHandleEvent(
                    keyboardPluginEvent,
                    editor,
                    false
                );
                expect(!!shouldHandleEvent).toBe(true);
            });
        });
    });

    describe('Handle Event | ', () => {
        it('HandleEvent 2', () => {
            editor.setContent(`<div id="${TEST_ELEMENT_ID}">*abcd</div>`);
            editor.focus();
            const element = document.getElementById(TEST_ELEMENT_ID);
            editor.select(element, PositionType.End);
            const rawEvent = new KeyboardEvent('keydown', {
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                cancelable: false,
            });

            runHandleEvent(rawEvent, false);
        });
    });
});
