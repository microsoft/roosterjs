import * as keyboardDelete from '../../lib/edit/keyboardDelete';
import * as keyboardInput from '../../lib/edit/keyboardInput';
import * as keyboardTab from '../../lib/edit/keyboardTab';
import { ContentModelEditPlugin } from '../../lib/edit/ContentModelEditPlugin';
import { IStandaloneEditor } from 'roosterjs-content-model-types';

describe('ContentModelEditPlugin', () => {
    let editor: IStandaloneEditor;

    beforeEach(() => {
        editor = ({
            getDOMSelection: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
        } as any) as IStandaloneEditor;
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
            const plugin = new ContentModelEditPlugin();
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
            const plugin = new ContentModelEditPlugin();
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
            const plugin = new ContentModelEditPlugin();
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
            const plugin = new ContentModelEditPlugin();
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
            const plugin = new ContentModelEditPlugin();
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
            const plugin = new ContentModelEditPlugin();
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
});
