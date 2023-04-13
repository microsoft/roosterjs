import * as blockFormat from 'roosterjs-editor-api/lib/utils/blockFormat';
import * as setIndentation from 'roosterjs-editor-api/lib/format/setIndentation';
import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import * as toggleListType from 'roosterjs-editor-api/lib/utils/toggleListType';
import getBlockElementAtNode from '../../../../roosterjs-editor-dom/lib/blockElements/getBlockElementAtNode';
import { ListFeatures } from '../../../lib/plugins/ContentEdit/features/listFeatures';
import { Position, PositionContentSearcher } from 'roosterjs-editor-dom';
import {
    IEditor,
    Indentation,
    PluginEventType,
    PluginKeyboardEvent,
    Keys,
    BlockElement,
    IContentTraverser,
} from 'roosterjs-editor-types';

describe('listFeatures | AutoBullet', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    let editorSearchCursorSpy: any;
    let editorIsFeatureEnabled: any;
    let editorBlockTraverserSpy: any;
    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        spyOn(editor, 'getElementAtCursor').and.returnValue(null);
        editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
        editorBlockTraverserSpy = spyOn(editor, 'getBlockTraverser');
        editorIsFeatureEnabled = spyOn(editor, 'isFeatureEnabled');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runListPatternTest(text: string, expectedResult: boolean) {
        const root = document.createElement('div');
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        editorIsFeatureEnabled.and.returnValue(false);
        const isAutoBulletTriggered = ListFeatures.autoBullet.shouldHandleEvent(null, editor, false)
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    function runTestWithNumberingStyles(text: string, expectedResult: boolean) {
        const wrapper = document.createElement('div');
        const root = document.createElement('div');
        root.innerText = text;
        wrapper.appendChild(root);
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        const block = getBlockElementAtNode(wrapper, root) as BlockElement;
        const traverser = {
            currentBlockElement: block,
        } as IContentTraverser;
        spyOn(traverser.currentBlockElement, 'getTextContent').and.returnValue(text);
        editorIsFeatureEnabled.and.returnValue(true);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        editorBlockTraverserSpy.and.returnValue(traverser);

        const isAutoBulletTriggered = ListFeatures.autoNumberingList.shouldHandleEvent(
            null,
            editor,
            false
        )
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    function runTestWithBulletStyles(text: string, expectedResult: boolean) {
        const wrapper = document.createElement('div');
        const root = document.createElement('div');
        root.innerText = text;
        wrapper.appendChild(root);
        const mockedPosition = new PositionContentSearcher(root, new Position(root, 4));
        spyOn(mockedPosition, 'getSubStringBefore').and.returnValue(text);
        const block = getBlockElementAtNode(wrapper, root) as BlockElement;
        const traverser = {
            currentBlockElement: block,
        } as IContentTraverser;
        spyOn(traverser.currentBlockElement, 'getTextContent').and.returnValue(text);
        editorIsFeatureEnabled.and.returnValue(true);
        editorSearchCursorSpy.and.returnValue(mockedPosition);
        editorBlockTraverserSpy.and.returnValue(traverser);
        const isAutoBulletTriggered = ListFeatures.autoBulletList.shouldHandleEvent(
            null,
            editor,
            false
        )
            ? true
            : false;
        expect(isAutoBulletTriggered).toBe(expectedResult);
    }

    it('AutoBullet detects the correct patterns', () => {
        runListPatternTest('1.', true);
        runListPatternTest('2.', true);
        runListPatternTest('1)', true);
        runListPatternTest('2)', true);
        runListPatternTest('90)', true);
        runListPatternTest('1-', true);
        runListPatternTest('2-', true);
        runListPatternTest('90-', true);
        runListPatternTest('(1)', true);
        runListPatternTest('(2)', true);
        runListPatternTest('(90)', true);
    });

    it('AutoBulletList detects the correct patterns', () => {
        runTestWithBulletStyles('*', true);
        runTestWithBulletStyles('-', true);
        runTestWithBulletStyles('--', true);
        runTestWithBulletStyles('->', true);
        runTestWithBulletStyles('-->', true);
        runTestWithBulletStyles('>', true);
        runTestWithBulletStyles('=>', true);
        runTestWithBulletStyles('—', true);
    });

    it('AutoNumberingList with styles detects the correct patterns', () => {
        runTestWithNumberingStyles('1.', true);
        runTestWithNumberingStyles('1-', true);
        runTestWithNumberingStyles('1)', true);
        runTestWithNumberingStyles('(1)', true);
        runTestWithNumberingStyles('i.', true);
        runTestWithNumberingStyles('i-', true);
        runTestWithNumberingStyles('i)', true);
        runTestWithNumberingStyles('(i)', true);
        runTestWithNumberingStyles('I.', true);
        runTestWithNumberingStyles('I-', true);
        runTestWithNumberingStyles('I)', true);
        runTestWithNumberingStyles('(I)', true);
        runTestWithNumberingStyles('A.', true);
        runTestWithNumberingStyles('A-', true);
        runTestWithNumberingStyles('A)', true);
        runTestWithNumberingStyles('(A)', true);
        runTestWithNumberingStyles('a.', true);
        runTestWithNumberingStyles('a-', true);
        runTestWithNumberingStyles('a)', true);
        runTestWithNumberingStyles('(a)', true);
    });

    it('AutoBullet with ignores incorrect not valid patterns', () => {
        runListPatternTest('1=', false);
        runListPatternTest('1/', false);
        runListPatternTest('1#', false);
        runListPatternTest(' ', false);
        runListPatternTest('', false);
    });

    it('AutoBulletList with ignores incorrect not valid patterns', () => {
        runTestWithBulletStyles('1=', false);
        runTestWithBulletStyles('1/', false);
        runTestWithBulletStyles('1#', false);
        runTestWithBulletStyles(' ', false);
        runTestWithBulletStyles('', false);
        runTestWithBulletStyles('long text a.', false);
        runTestWithBulletStyles('long text 1)', false);
    });

    it('AutoNumberingList with ignores incorrect not valid patterns', () => {
        runTestWithNumberingStyles('1=', false);
        runTestWithNumberingStyles('1/', false);
        runTestWithNumberingStyles('1#', false);
    });
});

describe('listFeatures | IndentWhenTab | OutdentWhenShiftTab', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    let setIndentationFn: jasmine.Spy;
    const getKeyboardEvent = (keysPressed: (keyof KeyboardEventInit)[], keyCode: number) =>
        new KeyboardEvent('keydown', {
            altKey: false,
            ctrlKey: false,
            keyCode,
            ...keysPressed.reduce(
                (obj, cv) => ({
                    ...obj,
                    [cv]: true,
                }),
                {}
            ),
        });
    let list: HTMLOListElement;

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        list = editor.getDocument().getElementById(TEST_ID) as HTMLOListElement;
        editor.setContent(`<ol id="${TEST_ID}"><li>1</li><li>2</li><li>3</li></ol>`);
        editor.focus();
        setIndentationFn = spyOn(setIndentation, 'default');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(
        indent: boolean,
        keysPressed: (keyof KeyboardEventInit)[],
        keyCode: number,
        shouldHandle: boolean,
        runAltShiftTest: boolean = false
    ) {
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(keysPressed, keyCode),
        };

        const feature = indent
            ? !runAltShiftTest
                ? ListFeatures.indentWhenTab
                : ListFeatures.indentWhenAltShiftRight
            : !runAltShiftTest
            ? ListFeatures.outdentWhenShiftTab
            : ListFeatures.outdentWhenAltShiftLeft;

        const triggered: boolean = !!feature.shouldHandleEvent(keyboardEvent, editor, false);
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(
        keysPressed: (keyof KeyboardEventInit)[],
        keyCode: number,
        indent: boolean,
        runAltShiftTest: boolean = false
    ) {
        const range = document.createRange();
        range.setStart(list, 0);
        range.setEnd(list, 1);
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(keysPressed, keyCode),
        };

        const feature = indent
            ? !runAltShiftTest
                ? ListFeatures.indentWhenTab
                : ListFeatures.indentWhenAltShiftRight
            : !runAltShiftTest
            ? ListFeatures.outdentWhenShiftTab
            : ListFeatures.outdentWhenAltShiftLeft;

        feature.handleEvent(keyboardEvent, editor);

        expect(setIndentationFn).toHaveBeenCalled();
        expect(setIndentationFn).toHaveBeenCalledWith(
            editor,
            indent ? Indentation.Increase : Indentation.Decrease
        );
    }

    it('should not handle event | indent with tab', () => {
        runTestShouldHandleEvent(true, ['shiftKey'], Keys.TAB, false);
    });

    it('should handle event | indent with tab', () => {
        runTestShouldHandleEvent(true, [], Keys.TAB, true);
    });

    it('should not handle event | outdent with shift + tab', () => {
        runTestShouldHandleEvent(false, [], Keys.TAB, false);
    });

    it('should handle event | outdent with shift + tab', () => {
        runTestShouldHandleEvent(false, ['shiftKey'], Keys.TAB, true);
    });

    it('handle indent | indent with tab', () => {
        runTestHandleEvent([], Keys.TAB, true);
    });

    it('should not handle event | indent with Alt + Shift + Arrow', () => {
        runTestShouldHandleEvent(true, ['shiftKey'], Keys.TAB, false, true);
    });

    it('should handle event | indent with Alt + Shift + Arrow', () => {
        runTestShouldHandleEvent(true, ['shiftKey', 'altKey'], Keys.RIGHT, true, true);
    });

    it('should not handle event | outdent with Alt + Shift + Arrow', () => {
        runTestShouldHandleEvent(false, ['shiftKey', 'altKey'], Keys.RIGHT, false, true);
        runTestShouldHandleEvent(false, ['shiftKey'], Keys.LEFT, false, true);
        runTestShouldHandleEvent(false, ['altKey'], Keys.LEFT, false, true);
    });

    it('should handle event | outdent with Alt + Shift + Arrow', () => {
        runTestShouldHandleEvent(false, ['shiftKey', 'altKey'], Keys.LEFT, true, true);
    });

    it('handle indent | indent with Alt + Shift + Arrow', () => {
        runTestHandleEvent(['shiftKey', 'altKey'], Keys.RIGHT, true, true);
    });

    it('handle indent | outdent with Alt + Shift + Arrow', () => {
        runTestHandleEvent(['shiftKey', 'altKey'], Keys.LEFT, true, true);
    });
});

describe('listFeatures | MergeInNewLine', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    const ITEM_2 = 'ITEM_2';
    let blockFormatFn: jasmine.Spy;
    let toggleListTypeFn: jasmine.Spy;
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        editor.setContent(
            `<ol id="${TEST_ID}"><li id="${ITEM_1}">1</li><li id="${ITEM_2}" >2</li><li>3</li></ol>`
        );
        editor.focus();
        blockFormatFn = spyOn(blockFormat, 'default');
        toggleListTypeFn = spyOn(toggleListType, 'default');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(isAtBeginning: boolean, shouldHandle: boolean) {
        const item = editor.getDocument().getElementById(ITEM_2) as HTMLLIElement;
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        const range = document.createRange();
        range.setStart(item, 0);
        if (isAtBeginning) {
            range.collapse();
        } else {
            range.setEnd(item, 1);
        }
        editor.select(range);

        const triggered = ListFeatures.mergeInNewLineWhenBackspaceOnFirstChar.shouldHandleEvent(
            keyboardEvent,
            editor,
            false
        )
            ? true
            : false;
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(isFirstElement: boolean) {
        const item = editor
            .getDocument()
            .getElementById(isFirstElement ? ITEM_1 : ITEM_2) as HTMLLIElement;
        const range = document.createRange();
        range.setStart(item, 0);
        range.setEnd(item, 0);
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        ListFeatures.mergeInNewLineWhenBackspaceOnFirstChar.handleEvent(keyboardEvent, editor);
        if (isFirstElement) {
            expect(toggleListTypeFn).toHaveBeenCalled();
            expect(toggleListTypeFn).toHaveBeenCalledWith(editor, 1, undefined, true);
        } else {
            expect(blockFormatFn).toHaveBeenCalled();
        }
    }

    it('should handle event', () => {
        runTestShouldHandleEvent(true, true);
    });

    it('should not handle event', () => {
        runTestShouldHandleEvent(false, false);
    });

    it('should handle block format', () => {
        runTestHandleEvent(false);
    });

    it('should handle toggle List', () => {
        runTestHandleEvent(true);
    });
});

describe('listFeatures | OutdentWhenBackOn1stEmptyLine', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    let toggleListTypeFn: jasmine.Spy;
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        toggleListTypeFn = spyOn(toggleListType, 'default');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(content: string, shouldHandle: boolean) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1) as HTMLLIElement;
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        const range = document.createRange();
        range.setStart(item, 0);
        range.collapse();
        editor.select(range);
        const triggered = ListFeatures.outdentWhenBackspaceOnEmptyFirstLine.shouldHandleEvent(
            keyboardEvent,
            editor,
            false
        )
            ? true
            : false;
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(content: string) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1) as HTMLLIElement;
        const range = document.createRange();
        range.setStart(item, 0);
        range.collapse();
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        ListFeatures.outdentWhenBackspaceOnEmptyFirstLine.handleEvent(keyboardEvent, editor);
        expect(toggleListTypeFn).toHaveBeenCalled();
        expect(toggleListTypeFn).toHaveBeenCalledWith(editor, 1, undefined, true);
    }

    it('should not handle event', () => {
        runTestShouldHandleEvent(
            `<ol id="${TEST_ID}"><li >1</li><li id="${ITEM_1}" >2</li><li>3</li></ol>`,
            false
        );
    });

    it('should  handle event', () => {
        runTestShouldHandleEvent(`<ol id="${TEST_ID}"><li id="${ITEM_1}"></li></ol>`, true);
    });

    it('should handle toggle List', () => {
        runTestHandleEvent(`<ol id="${TEST_ID}"><li id="${ITEM_1}"></li></ol>`);
    });
});

describe('listFeatures | MaintainListChainWhenDelete', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    const ITEM_2 = 'ITEM_2';
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestHandleEvent(content: string) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1);
        const range = document.createRange();
        range.setStart(item, 0);
        range.collapse();
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };

        const runAsync = spyOn(editor, 'runAsync');
        ListFeatures.maintainListChainWhenDelete.handleEvent(keyboardEvent, editor);
        expect(runAsync).toHaveBeenCalled();
    }

    it('should handle toggle List', () => {
        runTestHandleEvent(
            `<ol id="${TEST_ID}"><li id="${ITEM_1}">1</li><li id="${ITEM_2}">1</li></ol>`
        );
    });
});

describe('listFeatures | OutdentWhenEnterOnEmptyLine', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    let toggleListTypeFn: jasmine.Spy;
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
        toggleListTypeFn = spyOn(toggleListType, 'default');
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(content: string, shiftKey: boolean, shouldHandle: boolean) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1) as HTMLLIElement;
        if (item) {
            const range = document.createRange();
            range.setStart(item, 0);
            range.collapse();
            editor.select(range);
        }

        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(shiftKey),
        };

        const triggered = ListFeatures.outdentWhenEnterOnEmptyLine.shouldHandleEvent(
            keyboardEvent,
            editor,
            false
        )
            ? true
            : false;
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(content: string) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1) as HTMLLIElement;
        const range = document.createRange();
        range.setStart(item, 0);
        range.collapse();
        editor.select(range);
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };
        ListFeatures.outdentWhenBackspaceOnEmptyFirstLine.handleEvent(keyboardEvent, editor);
        expect(toggleListTypeFn).toHaveBeenCalled();
        expect(toggleListTypeFn).toHaveBeenCalledWith(editor, 1, undefined, true);
    }

    it('should handle event', () => {
        runTestShouldHandleEvent(`<ol id="${TEST_ID}"><li id="${ITEM_1}"></li></ol>`, false, true);
    });

    it('should not handle event | node not empty', () => {
        runTestShouldHandleEvent(
            `<ol id="${TEST_ID}"><li >1</li><li id="${ITEM_1}" >2</li><li>3</li></ol>`,
            true,
            false
        );
    });

    it('should not handle event | shift key', () => {
        runTestShouldHandleEvent(
            `<ol id="${TEST_ID}"><li >1</li><li id="${ITEM_1}" >2</li><li>3</li></ol>`,
            true,
            false
        );
    });

    it('should handle toggle List', () => {
        runTestHandleEvent(`<ol id="${TEST_ID}"><li id="${ITEM_1}"></li></ol>`);
    });
});

describe('listFeatures | MaintainListChain', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(content: string, shouldHandle: boolean) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(TEST_ID);
        if (item) {
            const range = document.createRange();
            range.setStart(item, 0);
            range.setEnd(item, 1);
            editor.select(range);
        }

        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };

        const triggered = ListFeatures.maintainListChain.shouldHandleEvent(
            keyboardEvent,
            editor,
            false
        )
            ? true
            : false;
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(content: string) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1);
        if (item) {
            const range = document.createRange();
            range.setStart(item, 1);
            range.collapse();
            editor.select(range);
        }
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };

        const runAsync = spyOn(editor, 'runAsync');
        ListFeatures.maintainListChain.handleEvent(keyboardEvent, editor);
        expect(runAsync).toHaveBeenCalled();
    }

    it('should handle event', () => {
        runTestShouldHandleEvent(
            `<ol id="${TEST_ID}"><li >1</li><li id="${ITEM_1}" >2</li><li>3</li></ol>`,
            true
        );
    });

    it('should not  handle event', () => {
        runTestShouldHandleEvent(`<span id="${ITEM_1}">1</span>`, false);
    });

    it('should handle editor async', () => {
        runTestHandleEvent(
            `<ol id="${TEST_ID}"><li >1</li><li id="${ITEM_1}" >2</li><li>3</li></ol>`
        );
    });
});

describe('listFeatures | mergeListOnBackspaceAfterList', () => {
    let editor: IEditor;
    const TEST_ID = 'listFeatureTests';
    const ITEM_1 = 'ITEM_1';
    const getKeyboardEvent = (shiftKey: boolean) =>
        new KeyboardEvent('keydown', {
            shiftKey,
            altKey: false,
            ctrlKey: false,
        });

    beforeEach(() => {
        editor = TestHelper.initEditor(TEST_ID);

        editor.runAsync = callback => {
            callback(editor);
            return () => {};
        };
    });

    afterEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement?.removeChild(element);
        }
        editor.dispose();
    });

    function runTestShouldHandleEvent(content: string, shouldHandle: boolean) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1);
        if (item) {
            const range = document.createRange();
            range.setStart(item, 0);
            editor.select(range);
        }

        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };

        const triggered = ListFeatures.mergeListOnBackspaceAfterList.shouldHandleEvent(
            keyboardEvent,
            editor,
            false
        )
            ? true
            : false;
        expect(triggered).toBe(shouldHandle);
    }

    function runTestHandleEvent(content: string) {
        editor.setContent(content);
        editor.focus();
        const item = editor.getDocument().getElementById(ITEM_1);
        if (item) {
            const range = document.createRange();
            range.setStart(item, 0);
            range.collapse();
            editor.select(range);
        }
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: getKeyboardEvent(false),
        };

        ListFeatures.mergeListOnBackspaceAfterList.shouldHandleEvent(keyboardEvent, editor, false);
        item?.parentElement?.removeChild(item);
        ListFeatures.mergeListOnBackspaceAfterList.handleEvent(keyboardEvent, editor);

        expect(editor.queryElements('ol,ul').length).toEqual(1);
    }

    it('should handle event', () => {
        runTestShouldHandleEvent(
            `<div><ol><li><span>123</span></li></ol><div id=${ITEM_1}><br></div><ol start="2"><li><span>213</span></li></ol><div><br></div></div>`,
            true
        );
    });

    it('Should not handle event, lists have different TagName', () => {
        runTestShouldHandleEvent(
            `<div><ul><li><span>123</span></li></ul><div id=${ITEM_1}><br></div><ol start="2"><li><span>213</span></li></ol><div><br></div></div>`,
            false
        );
    });

    it('should not handle event', () => {
        runTestShouldHandleEvent(`<span id="${ITEM_1}">1</span>`, false);
    });

    it('should handle editor async', () => {
        runTestHandleEvent(
            `<div><ol><li><span>123</span></li></ol><div id=${ITEM_1}><br></div><ol start="2"><li><span>213</span></li></ol><div><br></div></div>`
        );
    });
});
