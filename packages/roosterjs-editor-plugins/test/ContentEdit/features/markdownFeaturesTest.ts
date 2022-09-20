import {
    BuildInEditFeature,
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    PositionType,
} from 'roosterjs-editor-types';
import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { MarkdownFeatures } from '../../../lib/plugins/ContentEdit/features/markdownFeatures';

describe('MarkdownFeatures | ', () => {
    let editor: IEditor;
    const TEST_ID = 'MarkDownFeatureTest';
    const TEST_ELEMENT_ID = 'MarkDownFeatureTestElementId';

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

    function runShouldHandleEvent(
        content: string,
        shouldHandleExpect: boolean,
        markdownFeature: BuildInEditFeature<PluginKeyboardEvent>
    ) {
        editor.setContent(`<div id="${TEST_ELEMENT_ID}">${content}</div>`);
        const element = document.getElementById(TEST_ELEMENT_ID);
        editor.select(element, PositionType.End);
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: keyboardEvent(),
        };
        const shouldHandleEvent = markdownFeature.shouldHandleEvent(
            keyboardPluginEvent,
            editor,
            false /* ctrlOrMeta */
        );
        expect(!!shouldHandleEvent).toBe(shouldHandleExpect);
    }

    function runHandleEvent(
        markdownFeature: BuildInEditFeature<PluginKeyboardEvent>,
        testContent: string,
        expectedContent: string
    ) {
        editor.setContent(`<div id="${TEST_ELEMENT_ID}">${testContent}</div>`);
        const element = document.getElementById(TEST_ELEMENT_ID);
        editor.select(element, PositionType.End);
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: new KeyboardEvent('keydown', {
                shiftKey: true,
                altKey: false,
                ctrlKey: false,
                cancelable: false,
            }),
        };
        markdownFeature.handleEvent(keyboardPluginEvent, editor);
        const styledContent: string = element!.innerHTML;

        expect(styledContent).toContain(expectedContent);
    }

    describe('Should Handle Event | ', () => {
        describe('MarkdownBold | ', () => {
            const markdownBold = MarkdownFeatures.markdownBold;

            fit('Should handle in normal scenario 1', () => {
                runShouldHandleEvent('*abcd', true /* shouldHandleExpect */, markdownBold);
            });

            fit('Should handle in normal scenario 2', () => {
                runShouldHandleEvent('*abcd~', true /* shouldHandleExpect */, markdownBold);
            });

            fit('Should handle in normal scenario 3', () => {
                runShouldHandleEvent(
                    '*abcd defi 1234',
                    true /* shouldHandleExpect */,
                    markdownBold
                );
            });

            fit('Should not handle because of preceding whitespace', () => {
                runShouldHandleEvent('*abcd ', false /* shouldHandleExpect */, markdownBold);
            });

            fit('Should not handle because of preceding trigger character', () => {
                runShouldHandleEvent('*abcd*', false /* shouldHandleExpect */, markdownBold);
            });

            fit('Should not handle because of multiple whitespace', () => {
                runShouldHandleEvent('*abcd   ', false /* shouldHandleExpect */, markdownBold);
            });
        });
    });

    describe('Handle Event | ', () => {
        const markdownBold = MarkdownFeatures.markdownBold;
        fit('HandleEvent 2', () => {
            runHandleEvent(markdownBold, '*abcd', '<b>abcd</b>');
        });
    });
});
