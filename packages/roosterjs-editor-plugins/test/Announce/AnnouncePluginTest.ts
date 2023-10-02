import AnnouncePlugin from '../../lib/plugins/Announce/AnnouncePlugin';
import { IEditor, Keys, PluginEventType } from 'roosterjs-editor-types';

describe('AnnouncePlugin', () => {
    const mockEditor: IEditor = {
        getDocument: () => document,
        runAsync: (cb: () => void) => cb(),
    } as any;

    let getElementAtCursorSpy: jasmine.Spy;

    beforeEach(() => {
        getElementAtCursorSpy = jasmine.createSpy('getElementAtCursorSpy');
        mockEditor.getElementAtCursor = () => {
            getElementAtCursorSpy();
            return null;
        };
    });
    it('initialize', () => {
        const plugin = new AnnouncePlugin();
        plugin.initialize(mockEditor);

        expect((plugin as any).editor).toEqual(mockEditor);
    });

    it('onPluginEvent & dispose', () => {
        const mockStrings = 'MockStrings' as any;

        const plugin = new AnnouncePlugin(mockStrings);
        const mockAnnounceData = {
            text: 'Announcement text',
            defaultStrings: undefined,
            formatStrings: [],
        } as any;

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: 'Test',
            additionalData: {
                getAnnounceData: () => mockAnnounceData,
            },
        });

        expect(plugin.getAriaLiveElement()).toBeDefined();
        expect(plugin.getAriaLiveElement()?.textContent).toEqual(mockAnnounceData.text);
        plugin.dispose();
        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });

    it('onPluginEvent & replace {0}, {1}! with [Hello, World] => Hello World', () => {
        const mockStrings = 'MockStrings' as any;

        const plugin = new AnnouncePlugin(mockStrings);
        const announceData = {
            text: '{0}, {1}!',
            defaultStrings: undefined,
            formatStrings: ['Hello', 'World'],
        } as any;

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: 'Test',
            additionalData: {
                getAnnounceData: () => announceData,
            },
        });

        expect(plugin.getAriaLiveElement()).toBeDefined();
        expect(plugin.getAriaLiveElement()?.textContent).toEqual('Hello, World!');
        plugin.dispose();
        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });

    it('onPluginEvent & dispose, getAnnounceData returns undefined', () => {
        const mockStrings = 'MockStrings' as any;

        const plugin = new AnnouncePlugin(mockStrings);

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: 'Test',
            additionalData: {
                getAnnounceData: () => {
                    return undefined;
                },
            },
        });

        expect(plugin.getAriaLiveElement()).toBeUndefined();
        plugin.dispose();
        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });

    it('onPluginEvent & dispose, getAnnounceData is undefined', () => {
        const mockStrings = 'MockStrings' as any;

        const plugin = new AnnouncePlugin(mockStrings);

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.ContentChanged,
            source: 'Test',
        });

        expect(plugin.getAriaLiveElement()).toBeUndefined();
        plugin.dispose();
        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });

    it('onPluginEvent & dispose, handle feature', () => {
        const mockStrings = 'MockStrings' as any;
        const spyTest = jasmine.createSpy('spyTest');
        const plugin = new AnnouncePlugin(
            mockStrings,
            ['announceNewListItem', 'announceWarningOnLastTableCell'],
            [
                {
                    keys: [Keys.ENTER],
                    shouldHandle: () => {
                        spyTest();
                        return {
                            text: 'mockedText',
                        };
                    },
                },
            ]
        );

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: {
                which: Keys.ENTER,
            } as any,
        });

        expect(plugin.getAriaLiveElement()).toBeDefined();
        expect(plugin.getAriaLiveElement()?.textContent).toEqual('mockedText');
        expect(spyTest).toHaveBeenCalled();
        expect(getElementAtCursorSpy).toHaveBeenCalled();

        plugin.dispose();

        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });

    it('onPluginEvent & dispose, do not handle feature, event key not in features.', () => {
        const mockStrings = 'MockStrings' as any;
        const spyTest = jasmine.createSpy('spyTest');
        const plugin = new AnnouncePlugin(
            mockStrings,
            ['announceNewListItem', 'announceWarningOnLastTableCell'],
            [
                {
                    keys: [Keys.B],
                    shouldHandle: () => {
                        spyTest();
                        return {
                            text: 'mockedText',
                        };
                    },
                },
            ]
        );

        plugin.initialize(mockEditor);
        plugin.onPluginEvent({
            eventType: PluginEventType.KeyDown,
            rawEvent: {
                which: Keys.ENTER,
            } as any,
        });

        expect(plugin.getAriaLiveElement()).toBeUndefined();
        expect(spyTest).not.toHaveBeenCalled();
        expect(getElementAtCursorSpy).toHaveBeenCalled();

        plugin.dispose();

        expect(plugin.getAriaLiveElement()).toBeUndefined();
    });
});
