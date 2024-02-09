import * as keyboardDelete from '../../lib/edit/keyboardDelete';
import * as keyboardInput from '../../lib/edit/keyboardInput';
import * as keyboardTab from '../../lib/edit/keyboardTab';
import { EditPlugin } from '../../lib/edit/EditPlugin';
import { DOMEventRecord, IStandaloneEditor } from 'roosterjs-content-model-types';

describe('EditPlugin', () => {
    let plugin: EditPlugin;
    let editor: IStandaloneEditor;
    let eventMap: Record<string, any>;
    let attachDOMEventSpy: jasmine.Spy;
    let getEnvironmentSpy: jasmine.Spy;

    beforeEach(() => {
        attachDOMEventSpy = jasmine
            .createSpy('attachDOMEvent')
            .and.callFake((handlers: Record<string, DOMEventRecord>) => {
                eventMap = handlers;
            });

        getEnvironmentSpy = jasmine.createSpy('getEnvironment').and.returnValue({
            isAndroid: true,
        });

        editor = ({
            attachDomEvent: attachDOMEventSpy,
            getEnvironment: getEnvironmentSpy,
            getDOMSelection: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IStandaloneEditor;
    });

    afterEach(() => {
        plugin.dispose();
    });

    describe('onPluginEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;
        let keyboardInputSpy: jasmine.Spy;
        let keyboardTabSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'keyboardDelete');
            keyboardInputSpy = spyOn(keyboardInput, 'keyboardInput');
            keyboardTabSpy = spyOn(keyboardTab, 'keyboardTab');
        });

        it('Backspace', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Backspace' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
        });

        it('Delete', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Delete' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
        });

        it('Tab', () => {
            const plugin = new EditPlugin();
            const rawEvent = { key: 'Tab' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardTabSpy).toHaveBeenCalledWith(editor, rawEvent);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
        });

        it('Other key', () => {
            plugin = new EditPlugin();
            const rawEvent = { which: 41, key: 'A' } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).toHaveBeenCalledWith(editor, rawEvent);
        });

        it('Default prevented', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Delete', defaultPrevented: true } as any;

            plugin.initialize(editor);
            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
        });

        it('Trigger entity event first', () => {
            plugin = new EditPlugin();
            const wrapper = 'WRAPPER' as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'entityOperation',
                operation: 'overwrite',
                rawEvent: {
                    type: 'keydown',
                } as any,
                entity: wrapper,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: { key: 'Delete' } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                key: 'Delete',
            } as any);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: { key: 'Delete' } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(2);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, {
                key: 'Delete',
            } as any);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
        });
    });

    describe('onBeforeInputEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'keyboardDelete');
        });

        it('Handle deleteContentBackward event when key is unidentified', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Unidentified' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            eventMap.beforeinput.beforeDispatch(
                new InputEvent('beforeinput', {
                    inputType: 'deleteContentBackward',
                })
            );

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(1);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(
                editor,
                new KeyboardEvent('keydown', {
                    key: 'Backspace',
                    keyCode: 8,
                    which: 8,
                })
            );
        });

        it('Handle deleteContentForward event when key is unidentified', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Unidentified' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            eventMap.beforeinput.beforeDispatch(
                new InputEvent('beforeinput', {
                    inputType: 'deleteContentForward',
                })
            );

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(1);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(
                editor,
                new KeyboardEvent('keydown', {
                    key: 'Delete',
                    keyCode: 46,
                    which: 46,
                })
            );
        });
    });
});
