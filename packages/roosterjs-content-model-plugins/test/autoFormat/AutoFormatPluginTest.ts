import * as createLink from '../../lib/autoFormat/link/createLink';
import * as keyboardTrigger from '../../lib/autoFormat/list/keyboardListTrigger';
import * as unlink from '../../lib/autoFormat/link/unlink';
import { AutoFormatOptions, AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import { ContentChangedEvent, IEditor, KeyDownEvent } from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IEditor;

    beforeEach(() => {
        editor = ({
            focus: () => {},
            getDOMSelection: () =>
                ({
                    type: -1,
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
            event: KeyDownEvent,
            shouldCallTrigger: boolean,
            options?: {
                autoBullet: boolean;
                autoNumbering: boolean;
                autoUnlink: boolean;
                autoLink: boolean;
            }
        ) {
            const plugin = new AutoFormatPlugin(options);
            plugin.initialize(editor);

            plugin.onPluginEvent(event);

            if (shouldCallTrigger) {
                expect(keyboardListTriggerSpy).toHaveBeenCalledWith(
                    editor,
                    event.rawEvent,
                    options?.autoBullet ?? true,
                    options?.autoNumbering ?? true
                );
            } else {
                expect(keyboardListTriggerSpy).not.toHaveBeenCalled();
            }
        }

        it('should trigger keyboardListTrigger', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };
            runTest(event, true);
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: '*', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };

            runTest(event, false);
        });

        it('should not trigger keyboardListTrigger', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };

            runTest(event, false, { autoBullet: false, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };
            runTest(event, true, { autoBullet: true, autoNumbering: false } as AutoFormatOptions);
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };
            runTest(event, true, { autoBullet: false, autoNumbering: true } as AutoFormatOptions);
        });

        it('should not trigger keyboardListTrigger, because handledByEditFeature', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: true,
            };

            runTest(event, false);
        });

        it('should not trigger keyboardListTrigger, because defaultPrevented', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: true } as any,
                handledByEditFeature: false,
            };

            runTest(event, false);
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
            runTest(event, true);
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
            runTest(event, false);
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
            runTest(event, true);
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
});
