import * as changeFontSize from 'roosterjs-content-model-api/lib/publicApi/segment/changeFontSize';
import * as clearFormat from 'roosterjs-content-model-api/lib/publicApi/format/clearFormat';
import * as redo from 'roosterjs-content-model-core/lib/command/redo/redo';
import * as setShortcutIndentationCommand from '../../lib/shortcut/utils/setShortcutIndentationCommand';
import * as toggleBold from 'roosterjs-content-model-api/lib/publicApi/segment/toggleBold';
import * as toggleBullet from 'roosterjs-content-model-api/lib/publicApi/list/toggleBullet';
import * as toggleItalic from 'roosterjs-content-model-api/lib/publicApi/segment/toggleItalic';
import * as toggleNumbering from 'roosterjs-content-model-api/lib/publicApi/list/toggleNumbering';
import * as toggleUnderline from 'roosterjs-content-model-api/lib/publicApi/segment/toggleUnderline';
import * as undo from 'roosterjs-content-model-core/lib/command/undo/undo';
import { EditorEnvironment, IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { ShortcutPlugin } from '../../lib/shortcut/ShortcutPlugin';

const enum Keys {
    BACKSPACE = 8,
    SPACE = 32,
    A = 65,
    B = 66,
    I = 73,
    U = 85,
    Y = 89,
    Z = 90,
    COMMA = 188,
    PERIOD = 190,
    FORWARD_SLASH = 191,
    ArrowLeft = 37,
    ArrowRight = 39,
}

describe('ShortcutPlugin', () => {
    let preventDefaultSpy: jasmine.Spy;
    let mockedEditor: IEditor;
    let mockedEnvironment: EditorEnvironment;

    beforeEach(() => {
        preventDefaultSpy = jasmine.createSpy('preventDefault');
        mockedEnvironment = {} as any;
        mockedEditor = {
            getEnvironment: () => mockedEnvironment,
        } as any;
    });

    function createMockedEvent(
        which: number,
        ctrlKey: boolean,
        altKey: boolean,
        shiftKey: boolean,
        metaKey: boolean
    ): KeyboardEvent {
        return {
            which,
            ctrlKey,
            shiftKey,
            altKey,
            metaKey,
            preventDefault: preventDefaultSpy,
        } as any;
    }

    describe('Windows', () => {
        it('not a shortcut', () => {
            const apiSpy = spyOn(toggleBold, 'toggleBold');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.A, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bold', () => {
            const apiSpy = spyOn(toggleBold, 'toggleBold');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.B, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('italic', () => {
            const apiSpy = spyOn(toggleItalic, 'toggleItalic');
            const plugin = new ShortcutPlugin();

            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.I, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('underline', () => {
            const apiSpy = spyOn(toggleUnderline, 'toggleUnderline');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.U, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('clear format', () => {
            const apiSpy = spyOn(clearFormat, 'clearFormat');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.SPACE, true, false, false, false),
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
                rawEvent: createMockedEvent(Keys.Z, true, false, false, false),
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
                rawEvent: createMockedEvent(Keys.BACKSPACE, false, true, false, false),
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
                rawEvent: createMockedEvent(Keys.Y, true, false, false, false),
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
                rawEvent: createMockedEvent(Keys.Z, true, false, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bullet list', () => {
            const apiSpy = spyOn(toggleBullet, 'toggleBullet');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.PERIOD, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('numbering list', () => {
            const apiSpy = spyOn(toggleNumbering, 'toggleNumbering');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.FORWARD_SLASH, true, false, false, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('increase font', () => {
            const apiSpy = spyOn(changeFontSize, 'changeFontSize');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.PERIOD, true, false, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'increase');
        });

        it('decrease font', () => {
            const apiSpy = spyOn(changeFontSize, 'changeFontSize');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.COMMA, true, false, true, false),
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
            (mockedEnvironment as any).isMac = true;
        });

        it('not a shortcut', () => {
            const apiSpy = spyOn(toggleBold, 'toggleBold');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.A, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeFalse();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeUndefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).not.toHaveBeenCalled();
        });

        it('bold', () => {
            const apiSpy = spyOn(toggleBold, 'toggleBold');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.B, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('italic', () => {
            const apiSpy = spyOn(toggleItalic, 'toggleItalic');
            const plugin = new ShortcutPlugin();

            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.I, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('underline', () => {
            const apiSpy = spyOn(toggleUnderline, 'toggleUnderline');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.U, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('clear format', () => {
            const apiSpy = spyOn(clearFormat, 'clearFormat');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.SPACE, false, false, false, true),
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
                rawEvent: createMockedEvent(Keys.Z, false, false, false, true),
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
                rawEvent: createMockedEvent(Keys.BACKSPACE, false, true, false, false),
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
                rawEvent: createMockedEvent(Keys.Y, false, false, false, true),
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
                rawEvent: createMockedEvent(Keys.Z, false, false, true, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('bullet list', () => {
            const apiSpy = spyOn(toggleBullet, 'toggleBullet');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.PERIOD, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('numbering list', () => {
            const apiSpy = spyOn(toggleNumbering, 'toggleNumbering');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.FORWARD_SLASH, false, false, false, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor);
        });

        it('increase font', () => {
            const apiSpy = spyOn(changeFontSize, 'changeFontSize');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.PERIOD, false, false, true, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'increase');
        });

        it('decrease font', () => {
            const apiSpy = spyOn(changeFontSize, 'changeFontSize');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.COMMA, false, false, true, true),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'decrease');
        });

        it('indent list', () => {
            const apiSpy = spyOn(setShortcutIndentationCommand, 'setShortcutIndentationCommand');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.ArrowRight, false, true, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledTimes(1);
            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'indent');
        });

        it('outdent list', () => {
            const apiSpy = spyOn(setShortcutIndentationCommand, 'setShortcutIndentationCommand');
            const plugin = new ShortcutPlugin();
            const event: PluginEvent = {
                eventType: 'keyDown',
                rawEvent: createMockedEvent(Keys.ArrowLeft, false, true, true, false),
            };

            plugin.initialize(mockedEditor);

            const exclusively = plugin.willHandleEventExclusively(event);

            expect(exclusively).toBeTrue();
            expect(event.eventDataCache!.__ShortcutCommandCache).toBeDefined();

            plugin.onPluginEvent(event);

            expect(apiSpy).toHaveBeenCalledTimes(1);
            expect(apiSpy).toHaveBeenCalledWith(mockedEditor, 'outdent');
        });
    });
});
