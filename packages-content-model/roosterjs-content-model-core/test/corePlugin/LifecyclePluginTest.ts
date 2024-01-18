import * as color from 'roosterjs-content-model-dom/lib/formatHandlers/utils/color';
import { ChangeSource } from '../../lib/constants/ChangeSource';
import { createLifecyclePlugin } from '../../lib/corePlugin/LifecyclePlugin';
import { DarkColorHandler, IStandaloneEditor } from 'roosterjs-content-model-types';

describe('LifecyclePlugin', () => {
    it('init', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
        });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('');
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');
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
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
        });

        expect(setContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setContentModelSpy).toHaveBeenCalledWith(mockedModel, { ignoreSelection: true });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with DIV which already has contenteditable attribute', () => {
        const div = document.createElement('div');
        div.contentEditable = 'true';
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
            setContentModel: setContentModelSpy,
        }));

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('');
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

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
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
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
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('Handle ContentChangedEvent, not change color', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getColorManager: () => mockedDarkColorHandler,
            setContentModel: setContentModelSpy,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(2);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
        });

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: 'Test',
        });

        expect(setColorSpy).toHaveBeenCalledTimes(2);
        expect(state.isDarkMode).toBe(false);
    });

    it('Handle ContentChangedEvent, change color', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getColorManager: () => mockedDarkColorHandler,
            setContentModel: setContentModelSpy,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(2);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
        });

        const mockedIsDarkColor = 'Dark' as any;

        state.isDarkMode = mockedIsDarkColor;

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToDarkMode,
        });

        expect(setColorSpy).toHaveBeenCalledTimes(4);
        expect(setColorSpy).toHaveBeenCalledWith(
            div,
            '#000000',
            false,
            mockedIsDarkColor,
            mockedDarkColorHandler
        );
        expect(setColorSpy).toHaveBeenCalledWith(
            div,
            '#ffffff',
            true,
            mockedIsDarkColor,
            mockedDarkColorHandler
        );
    });

    it('Handle ContentChangedEvent, not change color when editor does not allow adjust container color', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin(
            {
                doNotAdjustEditorColor: true,
            },
            div
        );
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
            getDarkColorHandler: () => mockedDarkColorHandler,
            setContentModel: setContentModelSpy,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(0);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
        });

        const mockedIsDarkColor = 'Dark' as any;

        state.isDarkMode = mockedIsDarkColor;

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToDarkMode,
        });

        expect(setColorSpy).toHaveBeenCalledTimes(0);
    });
});
