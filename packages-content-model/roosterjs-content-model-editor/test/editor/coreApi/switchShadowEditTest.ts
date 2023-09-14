import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { PluginEventType } from 'roosterjs-editor-types';
import { switchShadowEdit } from '../../../lib/editor/coreApi/switchShadowEdit';

const mockedModel = 'MODEL' as any;
const mockedCachedModel = 'CACHEMODEL' as any;

describe('switchShadowEdit', () => {
    let core: ContentModelEditorCore;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let getSelectionRange: jasmine.Spy;
    let triggerEvent: jasmine.Spy;

    beforeEach(() => {
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        getSelectionRange = jasmine.createSpy('getSelectionRange');
        triggerEvent = jasmine.createSpy('triggerEvent');

        core = ({
            api: {
                createContentModel,
                setContentModel,
                getSelectionRange,
                triggerEvent,
            },
            lifecycle: {},
            contentDiv: document.createElement('div'),
            cache: {},
        } as any) as ContentModelEditorCore;
    });

    describe('was off', () => {
        it('no cache, isOn', () => {
            core.cache.cachedModel = undefined;
            switchShadowEdit(core, true);

            expect(createContentModel).toHaveBeenCalledWith(core);
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedModel);
            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: document.createDocumentFragment(),
                    selectionPath: undefined,
                },
                false
            );
        });

        it('with cache, isOn', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: PluginEventType.EnteredShadowEdit,
                    fragment: document.createDocumentFragment(),
                    selectionPath: undefined,
                },
                false
            );
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).not.toHaveBeenCalled();
        });

        it('with cache, isOff', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).not.toHaveBeenCalled();
        });
    });

    describe('was on', () => {
        beforeEach(() => {
            core.lifecycle.shadowEditFragment = {} as any;
        });

        it('no cache, isOn', () => {
            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).not.toHaveBeenCalled();
        });

        it('with cache, isOn', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, true);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).not.toHaveBeenCalled();
        });

        it('no cache, isOff', () => {
            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(core.cache.cachedModel).toBe(undefined);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false
            );
        });

        it('with cache, isOff', () => {
            core.cache.cachedModel = mockedCachedModel;

            switchShadowEdit(core, false);

            expect(createContentModel).not.toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalledWith(core, mockedCachedModel);
            expect(core.cache.cachedModel).toBe(mockedCachedModel);

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: PluginEventType.LeavingShadowEdit,
                },
                false
            );
        });
    });
});
