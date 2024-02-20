import * as toggleBold from 'roosterjs-content-model-api/lib/publicApi/segment/toggleBold';
import { EditorEnvironment, IEditor } from 'roosterjs-content-model-types';
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
        return {
            key: 'b',
            ctrlKey: true,
            shiftKey: false,
            altKey: false,
            preventDefault: preventDefaultSpy,
        } as any;
    }

    it('bold', () => {
        const toggleBoldSpy = spyOn(toggleBold, 'default');

        const plugin = new ShortcutPlugin();
        plugin.initialize(mockedEditor);

        plugin.onPluginEvent({
            eventType: 'keyDown',
            rawEvent: createMockedEvent('b', true, false, false),
        });

        expect(toggleBoldSpy).toHaveBeenCalledWith(mockedEditor);
    });
});
