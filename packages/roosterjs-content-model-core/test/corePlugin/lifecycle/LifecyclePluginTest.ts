import * as color from 'roosterjs-content-model-dom/lib/formatHandlers/utils/color';
import { ChangeSource } from 'roosterjs-content-model-dom';
import { createLifecyclePlugin } from '../../../lib/corePlugin/lifecycle/LifecyclePlugin';
import { DarkColorHandler, IEditor } from 'roosterjs-content-model-types';

describe('LifecyclePlugin', () => {
    it('init', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: undefined,
        });

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('text');
        expect(div.innerHTML).toBe('');
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });

    it('init with options', () => {
        const mockedModel = 'MODEL' as any;
        const mockedAnnouncerStringGetter = 'ANNOUNCE' as any;
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin(
            {
                defaultSegmentFormat: {
                    fontFamily: 'arial',
                },
                initialModel: mockedModel,
                announcerStringGetter: mockedAnnouncerStringGetter,
            },
            div
        );
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
        }));

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: mockedAnnouncerStringGetter,
        });

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

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
        }));

        expect(div.isContentEditable).toBeTrue();
        expect(div.style.userSelect).toBe('');
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

        plugin.dispose();
        expect(div.isContentEditable).toBeTrue();
    });

    it('init with DIV which already has contenteditable attribute and set to false', () => {
        const div = document.createElement('div');
        div.contentEditable = 'false';
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getFocusedPosition: () => <any>null,
            getColorManager: () => <DarkColorHandler | null>null,
            isDarkMode: () => false,
        }));

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
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getColorManager: () => mockedDarkColorHandler,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(2);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: undefined,
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
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getColorManager: () => mockedDarkColorHandler,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(2);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: undefined,
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
        const mockedDarkColorHandler = 'HANDLER' as any;

        const setColorSpy = spyOn(color, 'setColor');

        plugin.initialize(<IEditor>(<any>{
            triggerEvent,
            getColorManager: () => mockedDarkColorHandler,
        }));

        expect(setColorSpy).toHaveBeenCalledTimes(0);

        expect(state).toEqual({
            isDarkMode: false,
            shadowEditFragment: null,
            styleElements: {},
            announcerStringGetter: undefined,
        });

        const mockedIsDarkColor = 'Dark' as any;

        state.isDarkMode = mockedIsDarkColor;

        plugin.onPluginEvent({
            eventType: 'contentChanged',
            source: ChangeSource.SwitchToDarkMode,
        });

        expect(setColorSpy).toHaveBeenCalledTimes(0);
    });

    it('Dispose plugin and clean up style nodes', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);

        plugin.initialize(<any>{
            getColorManager: jasmine.createSpy(),
            triggerEvent: jasmine.createSpy(),
        });

        const state = plugin.getState();
        const removeChildSpy = jasmine.createSpy('removeChild');
        const style = {
            parentElement: {
                removeChild: removeChildSpy,
            },
        } as any;

        state.styleElements.a = style;

        plugin.dispose();

        expect(removeChildSpy).toHaveBeenCalledTimes(1);
        expect(removeChildSpy).toHaveBeenCalledWith(style);
        expect(state).toEqual({
            styleElements: {},
            isDarkMode: false,
            shadowEditFragment: null,
            announcerStringGetter: undefined,
        });
    });
});
