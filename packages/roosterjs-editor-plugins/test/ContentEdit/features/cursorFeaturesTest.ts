import * as TestHelper from 'roosterjs-editor-api/test/TestHelper';
import { CursorFeatures } from '../../../lib/plugins/ContentEdit/features/cursorFeatures';
import {
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    PositionType,
    Keys,
} from 'roosterjs-editor-types';
describe('CursorFeatures | ', () => {
    let editor: IEditor;
    const TEST_ID = 'CursorFeatureTest';
    const TEST_ELEMENT_ID = 'CursorFeatureTestTestElementId';
    const leftKey = Keys.LEFT;
    const rightKey = Keys.RIGHT;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor.dispose();
    });

    const keyboardEvent = (whichInput?: number) => {
        return new KeyboardEvent('keydown', {
            shiftKey: false,
            altKey: false,
            ctrlKey: false,
            cancelable: true,
            which: whichInput,
        });
    };

    function runShouldHandleEvent(
        content: string,
        shouldHandleExpect: boolean,
        rawKeyboardEvent: KeyboardEvent,
        ctrlOrMetaKey: boolean,
        selectContentCallback: (element: HTMLElement) => void,
        rtl: boolean = false
    ) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };
        editor.setContent(content);
        const cycleCursorMove = CursorFeatures.noCycleCursorMove;
        const element = document.getElementById(TEST_ELEMENT_ID);

        if (rtl && element) {
            element.style.direction = 'rtl';
        }
        editor.focus();
        selectContentCallback(element);
        const result = cycleCursorMove.shouldHandleEvent(
            keyboardPluginEvent,
            editor,
            ctrlOrMetaKey
        );

        expect(!!result).toBe(shouldHandleExpect);
    }

    function runHandleEvent(rawEvent: KeyboardEvent, expected: boolean) {
        const keyboardPluginEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawEvent,
        };
        const cycleCursorMove = CursorFeatures.noCycleCursorMove;
        cycleCursorMove.handleEvent(keyboardPluginEvent, editor);

        expect(keyboardPluginEvent.rawEvent.defaultPrevented).toBe(expected);
    }

    describe('noCycleCursorMove | ', () => {
        describe('Should Handle Event | ', () => {
            TestHelper.itFirefoxOnly('LTR No CTRLMeta Key', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    false,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin)
                );
            });

            TestHelper.itFirefoxOnly('LTR Select All Text', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    true,
                    keyboardEvent(leftKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin)
                );
            });

            TestHelper.itFirefoxOnly('LTR Select Right Key', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(rightKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin)
                );
            });

            TestHelper.itFirefoxOnly('LTR Select All Text, from beginning to end', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.Begin, element, PositionType.End)
                );
            });

            TestHelper.itFirefoxOnly('LTR Collapsed Range', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.End)
                );
            });

            TestHelper.itFirefoxOnly('RTL No CtrlMeta Key', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    false,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin),
                    true
                );
            });

            TestHelper.itFirefoxOnly('RTL Selection from end to beginning', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    true,
                    keyboardEvent(rightKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin),
                    true
                );
            });

            TestHelper.itFirefoxOnly('RTL Selection from beginning to end', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(rightKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.Begin, element, PositionType.End),
                    true
                );
            });

            TestHelper.itFirefoxOnly('RTL, left Key', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.Begin),
                    true
                );
            });

            TestHelper.itFirefoxOnly('RTL Collapsed Range', () => {
                runShouldHandleEvent(
                    `<div id="${TEST_ELEMENT_ID}">site.com</div>`,
                    false,
                    keyboardEvent(leftKey),
                    true,
                    (element: HTMLElement) =>
                        editor.select(element, PositionType.End, element, PositionType.End),
                    true
                );
            });
        });

        describe('Handle Event | ', () => {
            TestHelper.itFirefoxOnly('HandleEvent 1', () => {
                const rawEvent = new KeyboardEvent('keydown', {
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: false,
                    cancelable: true,
                });
                runHandleEvent(rawEvent, true);
            });

            TestHelper.itFirefoxOnly('HandleEvent 2', () => {
                const rawEvent = new KeyboardEvent('keydown', {
                    shiftKey: false,
                    altKey: false,
                    ctrlKey: false,
                    cancelable: false,
                });
                runHandleEvent(rawEvent, false);
            });
        });
    });
});
