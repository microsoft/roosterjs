import * as keyboardDelete from '../../lib/edit/keyboardDelete';
import * as keyboardEnter from '../../lib/edit/keyboardEnter';
import * as keyboardInput from '../../lib/edit/keyboardInput';
import * as keyboardTab from '../../lib/edit/keyboardTab';
import { DOMEventRecord, IEditor } from 'roosterjs-content-model-types';
import { EditPlugin } from '../../lib/edit/EditPlugin';
import { HandleTabOptions } from '../../lib/edit/EditOptions';

const DefaultHandleTabOptions: Required<HandleTabOptions> = {
    indentMultipleBlocks: true,
    indentTable: true,
    appendTableRow: true,
    indentList: true,
    indentParagraph: true,
};

describe('EditPlugin', () => {
    let plugin: EditPlugin;
    let editor: IEditor;
    let eventMap: Record<string, any>;
    let attachDOMEventSpy: jasmine.Spy;
    let getEnvironmentSpy: jasmine.Spy;
    let isExperimentalFeatureEnabledSpy: jasmine.Spy;

    beforeEach(() => {
        attachDOMEventSpy = jasmine
            .createSpy('attachDOMEvent')
            .and.callFake((handlers: Record<string, DOMEventRecord>) => {
                eventMap = handlers;
            });

        getEnvironmentSpy = jasmine.createSpy('getEnvironment').and.returnValue({
            isAndroid: true,
        });
        isExperimentalFeatureEnabledSpy = jasmine
            .createSpy('isExperimentalFeatureEnabled')
            .and.returnValue(false);

        editor = ({
            attachDomEvent: attachDOMEventSpy,
            getEnvironment: getEnvironmentSpy,
            getDOMSelection: () =>
                ({
                    type: -1,
                } as any), // Force return invalid range to go through content model code
            isExperimentalFeatureEnabled: isExperimentalFeatureEnabledSpy,
        } as any) as IEditor;
    });

    afterEach(() => {
        plugin.dispose();
    });

    describe('onPluginEvent', () => {
        let keyboardDeleteSpy: jasmine.Spy;
        let keyboardInputSpy: jasmine.Spy;
        let keyboardTabSpy: jasmine.Spy;
        let keyboardEnterSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardDeleteSpy = spyOn(keyboardDelete, 'keyboardDelete');
            keyboardInputSpy = spyOn(keyboardInput, 'keyboardInput');
            keyboardTabSpy = spyOn(keyboardTab, 'keyboardTab');
            keyboardEnterSpy = spyOn(keyboardEnter, 'keyboardEnter');
        });

        it('Backspace', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Backspace' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent, {
                handleTabKey: DefaultHandleTabOptions,
                handleExpandedSelectionOnDelete: true,
            });
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Delete', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Delete' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent, {
                handleTabKey: DefaultHandleTabOptions,
                handleExpandedSelectionOnDelete: true,
            });
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Shift+Delete', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Delete', shiftKey: true } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('handleExpandedSelectionOnDelete with options', () => {
            plugin = new EditPlugin({ shouldHandleEnterKey: true });
            const rawEvent = { key: 'Delete' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent, {
                handleTabKey: DefaultHandleTabOptions,
                handleExpandedSelectionOnDelete: true,
                shouldHandleEnterKey: true,
            });
        });

        it('Backspace with shouldHandleBackspaceKey boolean true', () => {
            plugin = new EditPlugin({ shouldHandleBackspaceKey: true });
            const rawEvent = { key: 'Backspace' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('handleExpandedSelectionOnDelete disabled', () => {
            plugin = new EditPlugin({ handleExpandedSelectionOnDelete: false });
            const rawEvent = { key: 'Delete' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(editor, rawEvent, {
                handleTabKey: DefaultHandleTabOptions,
                handleExpandedSelectionOnDelete: false,
            });
        });

        it('Tab', () => {
            plugin = new EditPlugin();
            const rawEvent = { key: 'Tab' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardTabSpy).toHaveBeenCalledWith(editor, rawEvent, DefaultHandleTabOptions);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
        });

        it('Tab - custom options with options', () => {
            plugin = new EditPlugin({
                shouldHandleEnterKey: true,
            });
            const rawEvent = { key: 'Tab' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardTabSpy).toHaveBeenCalledWith(editor, rawEvent, DefaultHandleTabOptions);
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
        });

        it('Tab, Tab handling not enabled', () => {
            plugin = new EditPlugin({ handleTabKey: false });
            const rawEvent = { key: 'Tab' } as any;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardTabSpy).toHaveBeenCalledWith(editor, rawEvent, {
                indentMultipleBlocks: false,
                indentTable: false,
                appendTableRow: false,
                indentList: false,
                indentParagraph: false,
            });
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
        });

        it('Enter, normal enter not enabled', () => {
            plugin = new EditPlugin();
            const rawEvent = { keyCode: 13, which: 13, key: 'Enter' } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, false, undefined);
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Enter, normal enter enabled with experimental feature', () => {
            isExperimentalFeatureEnabledSpy.and.callFake(
                (featureName: string) => featureName == 'HandleEnterKey'
            );
            plugin = new EditPlugin();
            const rawEvent = { keyCode: 13, which: 13, key: 'Enter' } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, undefined);
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Enter, normal enter enabled', () => {
            plugin = new EditPlugin({
                shouldHandleEnterKey: true,
            });
            const rawEvent = { keyCode: 13, which: 13, key: 'Enter' } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, undefined);
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Enter, normal enter enabled with callback', () => {
            plugin = new EditPlugin({
                shouldHandleEnterKey: _editor => {
                    return true;
                },
            });
            const rawEvent = { keyCode: 13, which: 13, key: 'Enter' } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, undefined);
            expect(keyboardTabSpy).not.toHaveBeenCalled();
        });

        it('Ctrl+Enter, nothing happens', () => {
            plugin = new EditPlugin();
            const rawEvent = { which: 13, key: 'Enter', ctrlKey: true } as any;
            const addUndoSnapshotSpy = jasmine.createSpy('addUndoSnapshot');

            editor.takeSnapshot = addUndoSnapshotSpy;

            plugin.initialize(editor);

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardDeleteSpy).not.toHaveBeenCalled();
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
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
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
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
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
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

            expect(keyboardDeleteSpy).toHaveBeenCalledWith(
                editor,
                {
                    key: 'Delete',
                } as any,
                { handleTabKey: DefaultHandleTabOptions, handleExpandedSelectionOnDelete: true }
            );

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent: { key: 'Delete' } as any,
            });

            expect(keyboardDeleteSpy).toHaveBeenCalledTimes(2);
            expect(keyboardDeleteSpy).toHaveBeenCalledWith(
                editor,
                {
                    key: 'Delete',
                } as any,
                { handleTabKey: DefaultHandleTabOptions, handleExpandedSelectionOnDelete: true }
            );
            expect(keyboardInputSpy).not.toHaveBeenCalled();
            expect(keyboardEnterSpy).not.toHaveBeenCalled();
            expect(keyboardTabSpy).not.toHaveBeenCalled();
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
                }),
                { handleTabKey: DefaultHandleTabOptions, handleExpandedSelectionOnDelete: true }
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
                }),
                { handleTabKey: DefaultHandleTabOptions, handleExpandedSelectionOnDelete: true }
            );
        });
    });

    describe('formatsToPreserveOnMerge integration tests', () => {
        let keyboardEnterSpy: jasmine.Spy;

        beforeEach(() => {
            keyboardEnterSpy = spyOn(keyboardEnter, 'keyboardEnter');
            // Configure editor to handle Enter key (needed for handleNormalEnter to return true)
            isExperimentalFeatureEnabledSpy.and.callFake((feature: string) => {
                return feature === 'HandleEnterKey';
            });
        });

        it('should pass formatsToPreserveOnMerge to keyboardEnter', () => {
            const options = {
                handleTabKey: true,
                handleExpandedSelectionOnDelete: true,
                formatsToPreserveOnMerge: ['className', 'fontFamily'],
            };

            plugin = new EditPlugin(options);
            plugin.initialize(editor);

            const rawEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardEnterSpy).toHaveBeenCalledTimes(1);
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, [
                'className',
                'fontFamily',
            ]);
        });

        it('should pass empty array when formatsToPreserveOnMerge is not specified', () => {
            const options = {
                handleTabKey: true,
                handleExpandedSelectionOnDelete: true,
            };

            plugin = new EditPlugin(options);
            plugin.initialize(editor);

            const rawEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardEnterSpy).toHaveBeenCalledTimes(1);
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, undefined);
        });

        it('should pass empty formatsToPreserveOnMerge array', () => {
            const options = {
                handleTabKey: true,
                handleExpandedSelectionOnDelete: true,
                formatsToPreserveOnMerge: [] as string[],
            };

            plugin = new EditPlugin(options);
            plugin.initialize(editor);

            const rawEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardEnterSpy).toHaveBeenCalledTimes(1);
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, []);
        });

        it('should work with multiple custom format properties', () => {
            const options = {
                handleTabKey: true,
                handleExpandedSelectionOnDelete: true,
                formatsToPreserveOnMerge: ['className', 'customProp', 'data-testid', 'fontFamily'],
            };

            plugin = new EditPlugin(options);
            plugin.initialize(editor);

            const rawEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                which: 13,
            });

            plugin.onPluginEvent({
                eventType: 'keyDown',
                rawEvent,
            });

            expect(keyboardEnterSpy).toHaveBeenCalledTimes(1);
            expect(keyboardEnterSpy).toHaveBeenCalledWith(editor, rawEvent, true, [
                'className',
                'customProp',
                'data-testid',
                'fontFamily',
            ]);
        });
    });
});
