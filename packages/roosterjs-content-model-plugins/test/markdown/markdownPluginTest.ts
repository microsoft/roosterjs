import * as setFormat from '../../lib/markdown/utils/setFormat';
import { MarkdownOptions, MarkdownPlugin } from '../../lib/markdown/MarkdownPlugin';
import {
    ContentChangedEvent,
    ContentModelCode,
    ContentModelSegmentFormat,
    EditorInputEvent,
    IEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';

describe('MarkdownPlugin', () => {
    let editor: IEditor;
    let setFormatSpy: jasmine.Spy;

    beforeEach(() => {
        editor = ({
            focus: () => {},
            getDOMSelection: () =>
                ({
                    type: 'range',
                    range: {
                        collapsed: true,
                    },
                } as any), // Force return invalid range to go through content model code
            formatContentModel: () => {},
        } as any) as IEditor;
        setFormatSpy = spyOn(setFormat, 'setFormat');
    });

    function runTest(
        events: (KeyDownEvent | EditorInputEvent | ContentChangedEvent)[],
        shouldCallTrigger: boolean,
        options?: MarkdownOptions,
        expectedChar?: string,
        expectedFormat?: ContentModelSegmentFormat,
        expectedCode?: ContentModelCode
    ) {
        const plugin = new MarkdownPlugin(options);
        plugin.initialize(editor);

        events.forEach(event => plugin.onPluginEvent(event));

        if (shouldCallTrigger) {
            if (expectedCode) {
                expect(setFormatSpy).toHaveBeenCalledWith(
                    editor,
                    expectedChar,
                    expectedFormat,
                    expectedCode
                );
            } else {
                expect(setFormatSpy).toHaveBeenCalledWith(editor, expectedChar, expectedFormat);
            }
        } else {
            expect(setFormatSpy).not.toHaveBeenCalled();
        }
    }

    it('should trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            true,
            { bold: true, italic: false, strikethrough: false },
            '*',
            { fontWeight: 'bold' }
        );
    });

    it('Feature disabled - should not trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: false, italic: false, strikethrough: false }
        );
    });

    it('should trigger setFormat for strikethrough', () => {
        runTest(
            [
                {
                    rawEvent: { data: '~', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '~', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            true,
            { bold: true, italic: true, strikethrough: true },
            '~',
            { strikethrough: true }
        );
    });

    it('Feature disabled - should not trigger setFormat for strikethrough', () => {
        runTest(
            [
                {
                    rawEvent: { data: '~', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '~', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: false, italic: false, strikethrough: false }
        );
    });

    it('should trigger setFormat for italic', () => {
        runTest(
            [
                {
                    rawEvent: { data: '_', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '_', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            true,
            { bold: true, italic: true, strikethrough: true },
            '_',
            { italic: true }
        );
    });

    it('Feature disabled - should not trigger setFormat for italic', () => {
        runTest(
            [
                {
                    rawEvent: { data: '_', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '_', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: false, italic: false, strikethrough: false }
        );
    });

    it('should trigger setFormat for code', () => {
        runTest(
            [
                {
                    rawEvent: { data: '`', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '`', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            true,
            { bold: true, italic: true, strikethrough: true, code: { format: {} } },
            '`',
            {},
            { format: {} }
        );
    });

    it('Feature disabled - should not trigger setFormat for code', () => {
        runTest(
            [
                {
                    rawEvent: { data: '`', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: 't', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { data: '`', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: true, italic: true, strikethrough: true, code: undefined }
        );
    });

    it('Backspace - should not trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { key: '*', defaultPrevented: false },
                    handledByEditFeature: false,
                    eventType: 'keyDown',
                } as KeyDownEvent,
                {
                    rawEvent: { key: 'Backspace', defaultPrevented: false },
                    handledByEditFeature: false,
                    eventType: 'keyDown',
                } as KeyDownEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: true, italic: false, strikethrough: false }
        );
    });

    it('Enter - should not trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { key: 'Enter', defaultPrevented: false },
                    handledByEditFeature: false,
                    eventType: 'keyDown',
                } as KeyDownEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: true, italic: false, strikethrough: false }
        );
    });

    it('Space - should not trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    rawEvent: { key: '*', defaultPrevented: false },
                    handledByEditFeature: false,
                    eventType: 'keyDown',
                } as KeyDownEvent,
                {
                    rawEvent: { key: ' ', defaultPrevented: false },
                    handledByEditFeature: false,
                    eventType: 'keyDown',
                } as KeyDownEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: true, italic: false, strikethrough: false }
        );
    });

    it('Event change - should not trigger setFormat for bold', () => {
        runTest(
            [
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
                {
                    source: 'Format',
                    eventType: 'contentChanged',
                } as ContentChangedEvent,
                {
                    rawEvent: { data: '*', inputType: 'insertText' },
                    eventType: 'input',
                } as EditorInputEvent,
            ],
            false,
            { bold: true, italic: false, strikethrough: false }
        );
    });
});
