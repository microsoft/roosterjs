import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ChangeSource } from '../../../lib/publicTypes/event/ContentModelContentChangedEvent';
import { ColorTransformDirection, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelEditorCore } from '../../../lib/publicTypes/ContentModelEditorCore';
import { createImage } from 'roosterjs-content-model-dom';
import { formatContentModel } from '../../../lib/editor/coreApi/formatContentModel';

describe('formatContentModel', () => {
    let core: ContentModelEditorCore;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let cacheContentModel: jasmine.Spy;
    let getFocusedPosition: jasmine.Spy;
    let triggerEvent: jasmine.Spy;
    let getVisibleViewport: jasmine.Spy;

    const apiName = 'mockedApi';
    const mockedContainer = 'C' as any;
    const mockedOffset = 'O' as any;
    const mockedSelection = 'Selection' as any;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine
            .createSpy('addUndoSnapshot')
            .and.callFake((_, callback) => callback?.());
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel').and.returnValue(mockedSelection);
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        getFocusedPosition = jasmine
            .createSpy('getFocusedPosition')
            .and.returnValue({ node: mockedContainer, offset: mockedOffset });
        triggerEvent = jasmine.createSpy('triggerPluginEvent');
        getVisibleViewport = jasmine.createSpy('getVisibleViewport');

        core = ({
            api: {
                addUndoSnapshot,
                createContentModel,
                setContentModel,
                cacheContentModel,
                getFocusedPosition,
                triggerEvent,
            },
            lifecycle: {},
            cache: {},
            getVisibleViewport,
        } as any) as ContentModelEditorCore;
    });

    it('Callback return false', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(false);

        formatContentModel(core, callback, { apiName });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).not.toHaveBeenCalled();
        expect(triggerEvent).not.toHaveBeenCalled();
    });

    it('Callback return true', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatContentModel(core, callback, { apiName });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[2]).toBe(null);
        expect(addUndoSnapshot.calls.argsFor(0)[3]).toBe(false);
        expect(addUndoSnapshot.calls.argsFor(0)[4]).toEqual({
            formatApiName: apiName,
        });
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Skip undo snapshot', () => {
        const callback = jasmine.createSpy('callback').and.callFake((model, context) => {
            context.skipUndoSnapshot = true;
            return true;
        });
        const mockedFormat = 'FORMAT' as any;

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(mockedFormat);
        spyOn(pendingFormat, 'setPendingFormat');

        formatContentModel(core, callback, { apiName });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            skipUndoSnapshot: true,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Customize change source', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatContentModel(core, callback, { changeSource: 'TEST', apiName });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(addUndoSnapshot.calls.argsFor(0)[2]).toBe(null!);
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: 'TEST',
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Customize change source, getChangeData and skip undo snapshot', () => {
        const callback = jasmine.createSpy('callback').and.callFake((model, context) => {
            context.skipUndoSnapshot = true;
            return true;
        });
        const returnData = 'DATA';

        formatContentModel(core, callback, {
            apiName,
            changeSource: 'TEST',
            getChangeData: () => returnData,
        });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            skipUndoSnapshot: true,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: 'TEST',
                data: returnData,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has onNodeCreated', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        formatContentModel(core, callback, { onNodeCreated: onNodeCreated, apiName });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            newImages: [],
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, onNodeCreated);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has entity got deleted', () => {
        const entity1 = {
            entityFormat: { id: 'E1', entityType: 'E', isReadonly: true },
            wrapper: {},
        } as any;
        const entity2 = {
            entityFormat: { id: 'E2', entityType: 'E', isReadonly: true },
            wrapper: {},
        } as any;
        const rawEvent = 'RawEvent' as any;

        formatContentModel(
            core,
            (model, context) => {
                context.deletedEntities.push(
                    {
                        entity: entity1,
                        operation: 'removeFromStart',
                    },
                    {
                        entity: entity2,
                        operation: 'removeFromEnd',
                    }
                );
                return true;
            },
            {
                apiName,
                rawEvent: rawEvent,
            }
        );

        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);

        expect(triggerEvent).toHaveBeenCalledTimes(3);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.EntityOperation,
                entity: { id: 'E1', type: 'E', isReadonly: true, wrapper: entity1.wrapper },
                operation: EntityOperation.RemoveFromStart,
                rawEvent: rawEvent,
            },
            false
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.EntityOperation,
                entity: { id: 'E2', type: 'E', isReadonly: true, wrapper: entity2.wrapper },
                operation: EntityOperation.RemoveFromEnd,
                rawEvent: rawEvent,
            },
            false
        );
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has new entity in dark mode', () => {
        const wrapper1 = 'W1' as any;
        const wrapper2 = 'W2' as any;
        const entity1 = {
            entityFormat: { id: 'E1', entityType: 'E', isReadonly: true },
            wrapper: wrapper1,
        } as any;
        const entity2 = {
            entityFormat: { id: 'E2', entityType: 'E', isReadonly: true },
            wrapper: wrapper2,
        } as any;
        const rawEvent = 'RawEvent' as any;
        const transformToDarkColorSpy = jasmine.createSpy('transformToDarkColor');
        const mockedData = 'DATA';

        core.lifecycle.isDarkMode = true;
        core.api.transformColor = transformToDarkColorSpy;

        formatContentModel(
            core,
            (model, context) => {
                context.newEntities.push(entity1, entity2);
                return true;
            },
            {
                apiName,
                rawEvent: rawEvent,
                getChangeData: () => mockedData,
            }
        );

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: mockedData,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
        expect(transformToDarkColorSpy).toHaveBeenCalledTimes(2);
        expect(transformToDarkColorSpy).toHaveBeenCalledWith(
            core,
            wrapper1,
            true,
            null,
            ColorTransformDirection.LightToDark
        );
        expect(transformToDarkColorSpy).toHaveBeenCalledWith(
            core,
            wrapper2,
            true,
            null,
            ColorTransformDirection.LightToDark
        );
    });

    it('With selectionOverride', () => {
        const range = 'MockedRangeEx' as any;

        formatContentModel(core, () => true, {
            apiName,
            selectionOverride: range,
        });

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(createContentModel).toHaveBeenCalledWith(core, undefined, range);
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has image', () => {
        const image = createImage('test');
        const rawEvent = 'RawEvent' as any;
        const getVisibleViewportSpy = jasmine
            .createSpy('getVisibleViewport')
            .and.returnValue({ top: 100, bottom: 200, left: 100, right: 200 });
        core.getVisibleViewport = getVisibleViewportSpy;

        formatContentModel(
            core,
            (model, context) => {
                context.newImages.push(image);
                return true;
            },
            {
                apiName,
                rawEvent: rawEvent,
            }
        );

        expect(getVisibleViewportSpy).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: mockedModel,
                selection: mockedSelection,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has shouldClearCachedModel', () => {
        formatContentModel(
            core,
            (model, context) => {
                context.clearModelCache = true;
                return true;
            },
            {
                apiName,
            }
        );

        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
        expect(triggerEvent).toHaveBeenCalledTimes(1);
        expect(triggerEvent).toHaveBeenCalledWith(
            core,
            {
                eventType: PluginEventType.ContentChanged,
                contentModel: undefined,
                selection: undefined,
                source: ChangeSource.Format,
                data: undefined,
                additionalData: {
                    formatApiName: apiName,
                },
            },
            true
        );
    });

    it('Has shouldClearCachedModel, and callback return false', () => {
        core.cache.cachedModel = 'Model' as any;
        core.cache.cachedSelection = 'Selection' as any;

        formatContentModel(
            core,
            (model, context) => {
                context.clearModelCache = true;
                return false;
            },
            {
                apiName,
            }
        );

        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).not.toHaveBeenCalled();
        expect(triggerEvent).not.toHaveBeenCalled();
        expect(core.cache).toEqual({
            cachedModel: undefined,
            cachedSelection: undefined,
        });
    });
});
