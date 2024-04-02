import * as createLink from '../../lib/autoFormat/link/createLink';
import * as createLinkAfterSpace from '../../lib/autoFormat/link/createLinkAfterSpace';
import * as keyboardTrigger from '../../lib/autoFormat/list/keyboardListTrigger';
import * as transformHyphen from '../../lib/autoFormat/hyphen/transformHyphen';
import * as unlink from '../../lib/autoFormat/link/unlink';
import { AutoFormatOptions, AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import {
    ContentChangedEvent,
    EditorInputEvent,
    IEditor,
    KeyDownEvent,
} from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IEditor;

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
    });

    describe('onPluginEvent - keyboardListTrigger', () => {
        let keyboardListTriggerSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardListTriggerSpy = spyOn(keyboardTrigger, 'keyboardListTrigger');
        });

        function runTest(
            event: EditorInputEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoBullet: boolean;
                autoNumbering: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(keyboardListTriggerSpy).toHaveBeenCalledWith(
                    editor,
                    options ? options.autoBullet : true,
                    options ? options.autoNumbering : true
                );
            } else {
                expect(keyboardListTriggerSpy).not.toHaveBeenCalled();
            }
        }

        it('should trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: '*', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
                autoBullet: true,
                autoNumbering: true,
            });
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, { autoBullet: false, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, { autoBullet: true, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', defaultPrevented: false, inputType: 'insertText' } as any,
            };
            runTest(event, true, { autoBullet: false, autoNumbering: true } as AutoFormatOptions);
        });

        it('should not trigger keyboardListTrigger if the input type is different from insertText', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { key: ' ', defaultPrevented: false, inputType: 'test' } as any,
            };
            runTest(event, false, { autoBullet: true, autoNumbering: true } as AutoFormatOptions);
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
        let createLinkAfterSpaceSpy: jasmine.Spy;

        beforeEach(() => {
            createLinkAfterSpaceSpy = spyOn(createLinkAfterSpace, 'createLinkAfterSpace');
        });

        function runTest(
            event: EditorInputEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoLink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(createLinkAfterSpaceSpy).toHaveBeenCalledWith(editor);
            } else {
                expect(createLinkAfterSpaceSpy).not.toHaveBeenCalled();
            }
        }

        it('should call createLinkAfterSpace', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoLink: true,
            });
        });

        it('should not call createLinkAfterSpace - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
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
            runTest(event, false, {
                autoLink: true,
            });
        });
    });

    describe('onPluginEvent - transformHyphen', () => {
        let transformHyphenSpy: jasmine.Spy;

        beforeEach(() => {
            transformHyphenSpy = spyOn(transformHyphen, 'transformHyphen');
        });

        function runTest(
            event: EditorInputEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoHyphen: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options as AutoFormatOptions);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(transformHyphenSpy).toHaveBeenCalledWith(editor);
            } else {
                expect(transformHyphenSpy).not.toHaveBeenCalled();
            }
        }

        it('should call transformHyphen', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, true, {
                autoHyphen: true,
            });
        });

        it('should not call transformHyphen - disable options', () => {
            const event: EditorInputEvent = {
                eventType: 'input',
                rawEvent: { data: ' ', preventDefault: () => {}, inputType: 'insertText' } as any,
            };
            runTest(event, false, {
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
            runTest(event, false, {
                autoHyphen: true,
            });
        });
    });
});
