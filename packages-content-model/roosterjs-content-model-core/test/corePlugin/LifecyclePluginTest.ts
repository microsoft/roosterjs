import { createLifecyclePlugin } from '../../lib/corePlugin/LifecyclePlugin';
import { DarkColorHandler } from 'roosterjs-editor-types';
import { IStandaloneEditor } from 'roosterjs-content-model-types';

describe('LifecyclePlugin', () => {
    it('init', () => {
        const div = document.createElement('div');
        const plugin = createLifecyclePlugin({}, div);
        const triggerEvent = jasmine.createSpy('triggerEvent');
        const state = plugin.getState();
        const setContentModelSpy = jasmine.createSpy('setContentModel');

        plugin.initialize(<IStandaloneEditor>(<any>{
            triggerEvent,
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
            setContent: (content: string) => (div.innerHTML = content),
            getFocusedPosition: () => <any>null,
            getDarkColorHandler: () => <DarkColorHandler | null>null,
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
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent.calls.argsFor(0)[0]).toBe('editorReady');

        plugin.dispose();
        expect(div.isContentEditable).toBeFalse();
    });
});
