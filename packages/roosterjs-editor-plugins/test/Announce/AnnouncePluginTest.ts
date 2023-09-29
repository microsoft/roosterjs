import { IEditor, PluginEventType } from 'roosterjs-editor-types';
import AnnouncePlugin, * as AnnouncePluginFile from '../../lib/plugins/Announce/AnnouncePlugin';

describe('AnnouncePlugin', () => {
    const mockEditor: IEditor = {
        getDocument: () => document,
    } as any;

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
});
