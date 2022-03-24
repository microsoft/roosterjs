import * as TestHelper from '../../../../roosterjs-editor-api/test/TestHelper';
import { AutoLinkFeatures } from '../../../lib/plugins/ContentEdit/features/autoLinkFeatures';
import {
    ImageInlineElement,
    LinkInlineElement,
    Position,
    PositionContentSearcher,
} from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ClipboardData,
    ContentChangedEvent,
    IEditor,
    PluginEventType,
    PluginKeyboardEvent,
    InlineElement,
    PositionType,
} from 'roosterjs-editor-types';
describe('AutoLinkFeature ShouldHandle Tests:  ', () => {
    let editor: IEditor;
    const TEST_ID = 'AutoLinkFeatureShouldHandleTests';
    const TEST_ELEMENT_ID = 'test';
    const rawKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
    });

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

    function runAutoLinkShouldHandleEvent(content: string, shouldHandleExpect: boolean) {
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };
        const autoLinkFeature = AutoLinkFeatures.autoLink;
        editor.setContent(content);
        const element = document.getElementById(TEST_ELEMENT_ID);
        editor.select(element, PositionType.End);
        const result = autoLinkFeature.shouldHandleEvent(keyboardEvent, editor, false);

        expect(!!result).toBe(shouldHandleExpect);
    }

    it('AutoLink | Should Handle Event', () => {
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">site.com</div>`, false);
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">asd</div>`, false);
        runAutoLinkShouldHandleEvent(
            `<div id="${TEST_ELEMENT_ID}"><span>site.com</span></div>`,
            false
        );
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}"></div>`, false);
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">nolink</div>`, false);

        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">www.site.com</div>`, true);
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">www.site</div>`, true);
        runAutoLinkShouldHandleEvent(
            `<div id="${TEST_ELEMENT_ID}">https://www.site.com</div>`,
            true
        );
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">https://site.com</div>`, true);
        runAutoLinkShouldHandleEvent(`<div id="${TEST_ELEMENT_ID}">https://www.site</div>`, true);
        runAutoLinkShouldHandleEvent(
            `<div id="${TEST_ELEMENT_ID}">telnet://192.168.0.0</div>`,
            true
        );
    });
});

describe('UnlinkFeature ShouldHandle Tests:  ', () => {
    let editor: IEditor;
    const TEST_ID = 'UnlinkFeatureShouldHandleTestsTests';
    let contentSearcherOfCursorSpy: jasmine.Spy;
    const rawKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        shiftKey: false,
    });

    beforeEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor = TestHelper.initEditor(TEST_ID);
        contentSearcherOfCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
    });

    afterEach(() => {
        editor.dispose();
    });

    function runUnLinkShouldHandleClipboardTest(element: InlineElement, expected: boolean) {
        const aulinkFeature = AutoLinkFeatures.unlinkWhenBackspaceAfterLink;
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };
        let mockElement = document.createElement('div');
        const mockedPositionContentSearcher = new PositionContentSearcher(
            mockElement,
            new Position(mockElement, 0)
        );
        spyOn(mockedPositionContentSearcher, 'getInlineElementBefore').and.returnValue(element);
        contentSearcherOfCursorSpy.and.returnValue(mockedPositionContentSearcher);
        const result = aulinkFeature.shouldHandleEvent(keyboardEvent, editor, false);
        expect(!!result).toBe(expected);
    }

    it('UnlinkWhenBackspaceAfterLink | Should Handle Event ', () => {
        runUnLinkShouldHandleClipboardTest(
            new ImageInlineElement(null, null) as InlineElement,
            false
        );
        runUnLinkShouldHandleClipboardTest(
            new LinkInlineElement(null, null) as InlineElement,
            true
        );
    });
});

describe('Auto Link ShouldHandle On Paste', () => {
    let editor: IEditor;
    const TEST_ID = 'AutoLinkShouldHandleOnPaste';
    const TEST_ELEMENT_ID = 'AutoLinkShouldHandleOnPastetest';
    const autoLinkFeature = AutoLinkFeatures.autoLink;
    let editorSearchCursorSpy: jasmine.Spy;

    beforeEach(() => {
        let element = document.getElementById(TEST_ID);
        if (element) {
            element.parentElement.removeChild(element);
        }
        editor = TestHelper.initEditor(TEST_ID);
        editorSearchCursorSpy = spyOn(editor, 'getContentSearcherOfCursor');
    });

    afterEach(() => {
        editor.dispose();
    });

    function runShouldHandleClipboardTest(
        clipboardText: string,
        inlineTextHTML: string,
        expected: boolean,
        trailingTest: boolean = false
    ) {
        const clipboard: ClipboardData = {
            customValues: null,
            image: null,
            rawHtml: null,
            text: clipboardText,
            types: [],
        };
        const event: ContentChangedEvent = {
            eventType: PluginEventType.ContentChanged,
            source: ChangeSource.Paste,
            data: clipboard,
        };
        editor.setContent(
            `<div id="${TEST_ELEMENT_ID}"><span style="font-size:medium;background-color:rgb(255, 255, 255);display:inline !important"><span style="font-size:medium;background-color:rgb(255, 255, 255);display:inline !important">${inlineTextHTML}</span></span><br></div>`
        );

        const element = document.getElementById(TEST_ID);
        editor.select(element, PositionType.End);
        const range = editor.getSelectionRange();

        const mockedPositionContentSearcher = new PositionContentSearcher(
            element,
            new Position(element, range.endOffset)
        );

        spyOn(mockedPositionContentSearcher, 'getRangeFromText').and.returnValue(
            trailingTest ? null : range
        );
        if (trailingTest) {
            spyOn(mockedPositionContentSearcher, 'getWordBefore').and.returnValue(inlineTextHTML);
        }
        editorSearchCursorSpy.and.returnValue(mockedPositionContentSearcher);

        editor.focus();

        const result = autoLinkFeature.shouldHandleEvent(event, editor, false);

        expect(!!result).toBe(expected);
    }

    it('AutoLink | Should Handle Event | Clipboard Link', () => {
        runShouldHandleClipboardTest('www.site.com', 'www.site.com', true);
        runShouldHandleClipboardTest('', 'www.site.com', false);

        runShouldHandleClipboardTest('www.site.com(', '', false, true);
        runShouldHandleClipboardTest('www.site.com)', '', false, true);
        runShouldHandleClipboardTest('www.site.com{', '', false, true);
        runShouldHandleClipboardTest('www.site.com}', '', false, true);
        runShouldHandleClipboardTest('www.site.com[', '', false, true);
        runShouldHandleClipboardTest('www.site.com]', '', false, true);

        runShouldHandleClipboardTest('www.site.com(', 'www.site.com(', false, true);
        runShouldHandleClipboardTest('www.site.com)', 'www.site.com)', true, true);

        runShouldHandleClipboardTest('www.site.com{', 'www.site.com{', false, true);
        runShouldHandleClipboardTest('www.site.com}', 'www.site.com}', true, true);

        runShouldHandleClipboardTest('www.site.com[', 'www.site.com[', false, true);
        runShouldHandleClipboardTest('www.site.com]', 'www.site.com]', true, true);
    });
});

describe('AutoLinkFeature HandleEvent Tests:  ', () => {
    const TEST_ID = 'AutoLinkFeatureHandleEvent';
    const TEST_ELEMENT_ID = 'test';
    const rawKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
    });

    let editor: IEditor;
    let editorContent: string;

    beforeEach(done => {
        editor = TestHelper.initEditor(TEST_ID);
        editor.runAsync = (callback: (editor: IEditor) => void) => {
            callback(editor);
            return () => {};
        };
        done();
    });

    afterEach(done => {
        editor.dispose();
        let deleteElement = document.getElementById(TEST_ID);
        deleteElement.parentElement.removeChild(deleteElement);
        done();
    });

    function runAutoLinkhandleEventTest(content: string) {
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };

        const autoLinkFeature = AutoLinkFeatures.autoLink;
        editor.setContent(content);
        const element = document.getElementById(TEST_ELEMENT_ID);
        editor.select(element.firstChild, PositionType.End);

        autoLinkFeature.handleEvent(keyboardEvent, editor);
    }

    function runWrap(content: string, expected: string) {
        runAutoLinkhandleEventTest(content);
        editorContent = editor.getContent();
        expect(editorContent).toBe(expected);
    }

    it('AutoLink | Handle Event 1', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site.com</div>`,
            `<div id="${TEST_ELEMENT_ID}"><a href="http://www.site.com">www.site.com</a></div>`
        );
    });

    it('AutoLink | Handle Event 2', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site</div>`,
            '<div id="test"><a href="http://www.site">www.site</a></div>'
        );
    });

    it('AutoLink | Handle Event 3', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://www.site.com</div>`,
            '<div id="test"><a href="https://www.site.com">https://www.site.com</a></div>'
        );
    });

    it('AutoLink | Handle Event 4', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site</div>`,
            '<div id="test"><a href="http://www.site">www.site</a></div>'
        );
    });

    it('AutoLink | Handle Event 5', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://site.com</div>`,
            '<div id="test"><a href="https://site.com">https://site.com</a></div>'
        );
    });

    it('AutoLink | Handle Event 6', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://www.site</div>`,
            '<div id="test"><a href="https://www.site">https://www.site</a></div>'
        );
    });

    it('AutoLink | Handle Event 7', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">telnet://192.168.0.0</div>`,
            '<div id="test"><a href="telnet://192.168.0.0">telnet://192.168.0.0</a></div>'
        );
    });
});

describe('UnlinkFeature HandleEvent Tests:  ', () => {
    const TEST_ID = 'AutoLinkFeatureHandleEvent';
    const TEST_ELEMENT_ID = 'test';
    const rawKeyboardEvent: KeyboardEvent = new KeyboardEvent('keydown', {
        shiftKey: false,
        altKey: false,
        ctrlKey: false,
    });

    let editor: IEditor;
    let editorContent: string;

    beforeEach(done => {
        editor = TestHelper.initEditor(TEST_ID);
        done();
    });

    afterEach(done => {
        editor.dispose();
        let deleteElement = document.getElementById(TEST_ID);
        deleteElement.parentElement.removeChild(deleteElement);
        done();
    });

    function runAutoLinkhandleEventTest(content: string) {
        const keyboardEvent: PluginKeyboardEvent = {
            eventType: PluginEventType.KeyDown,
            rawEvent: rawKeyboardEvent,
        };

        editor.setContent(content);
        const element = document.getElementById(TEST_ELEMENT_ID);
        editor.select(element.firstChild, PositionType.End);

        AutoLinkFeatures.unlinkWhenBackspaceAfterLink.handleEvent(keyboardEvent, editor);
    }

    function runWrap(expected: string, content: string) {
        runAutoLinkhandleEventTest(content);
        editorContent = editor.getContent();
        expect(editorContent).toBe(expected);
    }

    it('Unlink | Handle Event 1', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site.com</div>`,
            `<div id="${TEST_ELEMENT_ID}"><a href="http://www.site.com">www.site.com</a></div>`
        );
    });

    it('Unlink | Handle Event 2', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site</div>`,
            '<div id="test"><a href="http://www.site">www.site</a></div>'
        );
    });

    it('Unlink | Handle Event 3', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://www.site.com</div>`,
            '<div id="test"><a href="https://www.site.com">https://www.site.com</a></div>'
        );
    });

    it('Unlink | Handle Event 4', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">www.site</div>`,
            '<div id="test"><a href="http://www.site">www.site</a></div>'
        );
    });

    it('Unlink | Handle Event 5', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://site.com</div>`,
            '<div id="test"><a href="https://site.com">https://site.com</a></div>'
        );
    });

    it('Unlink | Handle Event 6', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">https://www.site</div>`,
            '<div id="test"><a href="https://www.site">https://www.site</a></div>'
        );
    });

    it('Unlink | Handle Event 7', () => {
        runWrap(
            `<div id="${TEST_ELEMENT_ID}">telnet://192.168.0.0</div>`,
            '<div id="test"><a href="telnet://192.168.0.0">telnet://192.168.0.0</a></div>'
        );
    });
});
