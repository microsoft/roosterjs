import * as changeFontSize from 'roosterjs-content-model-api/lib/publicApi/segment/changeFontSize';
import * as clearFormat from 'roosterjs-content-model-api/lib/publicApi/format/clearFormat';
import * as redo from 'roosterjs-content-model-core/lib/publicApi/undo/redo';
import * as toggleBold from 'roosterjs-content-model-api/lib/publicApi/segment/toggleBold';
import * as toggleBullet from 'roosterjs-content-model-api/lib/publicApi/list/toggleBullet';
import * as toggleItalic from 'roosterjs-content-model-api/lib/publicApi/segment/toggleItalic';
import * as toggleNumbering from 'roosterjs-content-model-api/lib/publicApi/list/toggleNumbering';
import * as toggleUnderline from 'roosterjs-content-model-api/lib/publicApi/segment/toggleUnderline';
import * as undo from 'roosterjs-content-model-core/lib/publicApi/undo/undo';
import { EditorEnvironment, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { ShortcutPlugin } from '../../lib/shortcut/ShortcutPlugin';

describe('ShortcutPlugin', () => {
    let preventDefaultSpy: jasmine.Spy;
    let mockedEditor: IEditor;
    let mockedEnvironment: EditorEnvironment;

    beforeEach(() => {
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        mockedEnvironment = {};
        mockedEditor = {
            getEnvironment: () => mockedEnvironment,
        } as any;
    });

    function createMockedEvent(
        key: string,
        ctrlKey: boolean,
        altKey: boolean,
        shiftKey: boolean
    ): KeyboardEvent {
        return { key, ctrlKey, shiftKey, altKey, preventDefault: preventDefaultSpy } as any;
    }

    describe('Windows', () => {
        it('not a shortcut', () => {
            const apiSpy = spyOn(toggleBold, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('a', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bold', () => {
            const apiSpy = spyOn(toggleBold, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('b', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('italic', () => {
            const apiSpy = spyOn(toggleItalic, 'default');
            const plugin = new ShortcutPlugin();

            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('i', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('underline', () => {
            const apiSpy = spyOn(toggleUnderline, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('u', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('clear format', () => {
            const apiSpy = spyOn(clearFormat, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(' ', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('undo 1', () => {
            const apiSpy = spyOn(undo, 'undo');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('z', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('undo 2', () => {
            const apiSpy = spyOn(undo, 'undo');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('Backspace', false, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('redo 1', () => {
            const apiSpy = spyOn(redo, 'redo');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('y', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('redo 2', () => {
            const apiSpy = spyOn(redo, 'redo');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('z', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bullet list', () => {
            const apiSpy = spyOn(toggleBullet, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('.', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('numbering list', () => {
            const apiSpy = spyOn(toggleNumbering, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('/', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('increase font', () => {
            const apiSpy = spyOn(changeFontSize, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('>', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'increase');
        });

        it('decrease font', () => {
            const apiSpy = spyOn(changeFontSize, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('<', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'decrease');
        });
    });

    describe('Mac', () => {
        beforeEach(() => {
            mockedEnvironment.isMac = true;
        });

        it('not a shortcut', () => {
            const apiSpy = spyOn(toggleBold, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('a', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bold', () => {
            const apiSpy = spyOn(toggleBold, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('b', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('italic', () => {
            const apiSpy = spyOn(toggleItalic, 'default');
            const plugin = new ShortcutPlugin();

            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('i', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('underline', () => {
            const apiSpy = spyOn(toggleUnderline, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('u', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('clear format', () => {
            const apiSpy = spyOn(clearFormat, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(' ', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('undo 1', () => {
            const apiSpy = spyOn(undo, 'undo');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('z', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('undo 2', () => {
            const apiSpy = spyOn(undo, 'undo');

            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('Backspace', false, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('redo 1', () => {
            const apiSpy = spyOn(redo, 'redo');

            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('y', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('redo 2', () => {
            const apiSpy = spyOn(redo, 'redo');

            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('z', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('bullet list', () => {
            const apiSpy = spyOn(toggleBullet, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('.', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('numbering list', () => {
            const apiSpy = spyOn(toggleNumbering, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('/', true, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('increase font', () => {
            const apiSpy = spyOn(changeFontSize, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('>', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'increase');
        });

        it('decrease font', () => {
            const apiSpy = spyOn(changeFontSize, 'default');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent('<', true, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'decrease');
        });
    });
});
