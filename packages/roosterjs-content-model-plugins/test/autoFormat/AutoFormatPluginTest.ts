import * as createLink from '../../lib/autoFormat/link/createLink';
import * as formatTextSegmentBeforeSelectionMarker from 'roosterjs-content-model-api/lib/publicApi/utils/formatTextSegmentBeforeSelectionMarker';
import * as unlink from '../../lib/autoFormat/link/unlink';
import { AutoFormatOptions, AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import { createLinkAfterSpace } from '../../lib/autoFormat/link/createLinkAfterSpace';
import { keyboardListTrigger } from '../../lib/autoFormat/list/keyboardListTrigger';
import { transformHyphen } from '../../lib/autoFormat/hyphen/transformHyphen';
import {
    ContentChangedEvent,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelText,
    EditorInputEvent,
    FormatContentModelContext,
    IEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IEditor;
    let formatTextSegmentBeforeSelectionMarkerSpy: jasmine.Spy;
    let triggerEventSpy: jasmine.Spy;

    beforeEach(() => {
        formatTextSegmentBeforeSelectionMarkerSpy = spyOn(
            formatTextSegmentBeforeSelectionMarker,
            'formatTextSegmentBeforeSelectionMarker'
        );
        triggerEventSpy = jasmine.createSpy('triggerEvent');
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
            triggerEvent: triggerEventSpy,
        } as any) as IEditor;
    });

    describe('onPluginEvent - keyboardListTrigger', () => {
        function runTest(
            event: EditorInputEvent,
            options?: {
                autoBullet: boolean;
                autoNumbering: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            const formatOptions = {
                apiName: '',
            };
            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        model: ContentModelDocument,
                        _previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        const result = keyboardListTrigger(
                            model,
                            paragraph,
                            context,
                            options!.autoBullet,
                            options!.autoNumbering
                        );
                        formatOptions.apiName = result ? 'autoToggleList' : '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOptions.apiName,
                });
            });
        }

        it('should trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: '*', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, { autoBullet: false, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, { autoBullet: true, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, { autoBullet: false, autoNumbering: true } as AutoFormatOptions);
        });

        it('should not trigger keyboardListTrigger if the input type is different from insertText', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { key: ' ', defaultPrevented: false, inputType: 'test' } as any,
            };
            runTest(event, { autoBullet: true, autoNumbering: true } as AutoFormatOptions);
        });
    });

    describe('onPluginEvent - createLink', () => {
        let createLinkSpy: jasmine.Spy;

        beforeEach(() => {
            createLinkSpy = spyOn(createLink, 'createLink');
        });

        function runTest(
            event: ContentChangedEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoLink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(createLinkSpy).toHaveBeenCalledWith(editor);
            } else {
                expect(createLinkSpy).not.toHaveBeenCalled();
            }
        }

        it('should call createLink', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Paste',
            };
            runTest(event, true, {
                autoLink: true,
            });
        });

        it('should not  call createLink - autolink disabled', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Paste',
            };
            runTest(event, false, { autoLink: false });
        });

        it('should not  call createLink - not paste', () => {
            const event: ContentChangedEvent = {
                eventType: 'contentChanged',
                source: 'Format',
            };
            runTest(event, false, {
                autoLink: true,
            });
        });
    });

    describe('onPluginEvent - unlink', () => {
        let unlinkSpy: jasmine.Spy;

        beforeEach(() => {
            unlinkSpy = spyOn(unlink, 'unlink');
        });

        function runTest(
            event: KeyDownEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoUnlink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(unlinkSpy).toHaveBeenCalledWith(editor, event.rawEvent);
            } else {
                expect(unlinkSpy).not.toHaveBeenCalled();
            }
        }

        it('should call unlink', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: 'Backspace', preventDefault: () => {} } as any,
            };
            runTest(event, true, {
                autoUnlink: true,
            });
        });

        it('should not call unlink - disable options', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: 'Backspace', preventDefault: () => {} } as any,
            };
            runTest(event, false, {
                autoUnlink: false,
            });
        });

        it('should not call unlink - not backspace', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', preventDefault: () => {} } as any,
            };
            runTest(event, false);
        });
    });

    describe('onPluginEvent - createLinkAfterSpace', () => {
        function runTest(
            event: EditorInputEvent,
            options?: {
                autoLink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);
            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        return (
                            options &&
                            options.autoLink &&
                            createLinkAfterSpace(previousSegment, paragraph, context)
                        );
                    }
                );
            });
        }

        it('should call createLinkAfterSpace', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoLink: true,
            });
        });

        it('should not call createLinkAfterSpace - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoLink: false,
            });
        });

        it('should not call createLinkAfterSpace - not space', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: {
                    data: 'Backspace',
                    preventDefault: () => {},
                    inputType: 'insertText',
                } as any,
            };
            runTest(event, {
                autoLink: true,
            });
        });
    });

    describe('onPluginEvent - transformHyphen', () => {
        function runTest(
            event: EditorInputEvent,
            options?: {
                autoHyphen: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);
            plugin.onPluginEvent(event);
            const formatOption = {
                apiName: '',
            };
            formatTextSegmentBeforeSelectionMarkerSpy.and.callFake((editor, callback, options) => {
                expect(callback).toBe(
                    editor,
                    (
                        _model: ContentModelDocument,
                        previousSegment: ContentModelText,
                        paragraph: ContentModelParagraph,
                        context: FormatContentModelContext
                    ) => {
                        let result = false;

                        if (options && options.autoHyphen) {
                            result = transformHyphen(previousSegment, paragraph, context);
                        }

                        formatOption.apiName = result ? 'autoHyphen' : '';
                        return result;
                    }
                );
                expect(options).toEqual({
                    changeSource: 'AutoFormat',
                    apiName: formatOption.apiName,
                });
            });
        }

        it('should call transformHyphen', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoHyphen: true,
            });
        });

        it('should not call transformHyphen - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, {
                autoHyphen: false,
            });
        });

        it('should not call transformHyphen - not space', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: {
                    data: 'Backspace',
                    preventDefault: () => {},
                    inputType: 'insertText',
                } as any,
            };
            runTest(event, {
                autoHyphen: true,
            });
        });
    });
});
