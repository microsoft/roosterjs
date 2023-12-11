import { createLifecyclePlugin } from '../../lib/corePlugin/LifecyclePlugin';
import { DarkColorHandler, IEditor, PluginEventType } from 'roosterjs-editor-types';

describe('LifecyclePlugin', () => {
    it('init', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            onExternalContentTransform: null,
            shadowEditFragment: null,
        });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);
        expect(setContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setContentModelSpy).toHaveBeenCalledWith(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                            { segmentType: 'Br', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            { ignoreSelection: true }
        );

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with options', () => {
        const mockedModel = 'MODEL' as any;
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin(
            {
                defaultSegmentFormat: {
                    fontFamily: 'arial',
                },
                initialModel: mockedModel,
            },
            div
        );
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            onExternalContentTransform: null,
            shadowEditFragment: null,
        });

        expect(setContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setContentModelSpy).toHaveBeenCalledWith(mockedModel, { ignoreSelection: true });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with DIV which already has contenteditable attribute', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        const plugin = createLifecyclePlugin({}, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        expect(setContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setContentModelSpy).toHaveBeenCalledWith(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                            { segmentType: 'Br', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            { ignoreSelection: true }
        );

        plugin.dispose();
        expect(div.isContentEditable).toBeTrue();
    });

    it('init with DIV which already has contenteditable attribute and set to false', () => {
        const div = document.createElement('div');
        div.contentEditable = 'false';
        const plugin = createLifecyclePlugin({}, div);
        const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IEditor>(<any>{
            triggerPluginEvent,
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(setContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setContentModelSpy).toHaveBeenCalledWith(
            {
                blockGroupType: 'Document',
                blocks: [
                    {
                        blockType: 'Paragraph',
                        segments: [
                            { segmentType: 'SelectionMarker', isSelected: true, format: {} },
                            { segmentType: 'Br', format: {} },
                        ],
                        format: {},
                    },
                ],
            },
            { ignoreSelection: true }
        );
        expect(div.isContentEditable).toBeFalse();
        expect(div.style.userSelect).toBe('');
        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent.calls.argsFor(0)[0]).toBe(PluginEventType.EditorReady);

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });
});
