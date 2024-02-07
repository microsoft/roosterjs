import * as keyboardTrigger from '../../lib/autoFormat/keyboardListTrigger';
import { AutoFormatPlugin } from '../../lib/autoFormat/AutoFormatPlugin';
import { IContentModelEditor } from 'roosterjs-content-model-editor';
import { KeyDownEvent } from 'roosterjs-content-model-types';

describe('Content Model Auto Format Plugin Test', () => {
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            focus: () => {},
            getDOMSelection: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IContentModelEditor;
    });

    describe('onPluginEvent', () => {
        let keyboardListTriggerSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardListTriggerSpy = spyOn(keyboardTrigger, 'keyboardListTrigger');
        });

        function runTest(
            event: KeyDownEvent,
            shouldCallTrigger: boolean,
            options?: { autoBullet: boolean; autoNumbering: boolean }
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

            runTest(event, false, { autoBullet: false, autoNumbering: false });
        });

        it('should trigger keyboardListTrigger with auto bullet only', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };
            runTest(event, true, { autoBullet: true, autoNumbering: false });
        });

        it('should trigger keyboardListTrigger with auto numbering only', () => {
            const event: KeyDownEvent = {
                eventType: 'keyDown',
                rawEvent: { key: ' ', defaultPrevented: false, preventDefault: () => {} } as any,
                handledByEditFeature: false,
            };
            runTest(event, true, { autoBullet: false, autoNumbering: true });
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
});
