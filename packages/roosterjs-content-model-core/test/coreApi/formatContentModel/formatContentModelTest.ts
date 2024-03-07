import * as transformColor from 'roosterjs-content-model-dom/lib/domUtils/color/transformColor';
import { ChangeSource } from '../../../lib/constants/ChangeSource';
import { createImage } from 'roosterjs-content-model-dom';
import { formatContentModel } from '../../../lib/coreApi/formatContentModel/formatContentModel';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    FormatContentModelContext,
    EditorCore,
} from 'roosterjs-content-model-types';

describe('formatContentModel', () => {
    let core: EditorCore;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let cacheContentModel: jasmine.Spy;
    let getFocusedPosition: jasmine.Spy;
    let triggerEvent: jasmine.Spy;
    let getDOMSelection: jasmine.Spy;
    let hasFocus: jasmine.Spy;

    const apiName = 'mockedApi';
    const mockedContainer = 'C' as any;
    const mockedOffset = 'O' as any;
    const mockedSelection = 'Selection' as any;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot');
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel').and.returnValue(mockedSelection);
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        getFocusedPosition = jasmine
            .createSpy('getFocusedPosition')
            .and.returnValue({ node: mockedContainer, offset: mockedOffset });
        triggerEvent = jasmine.createSpy('triggerEvent');
        getDOMSelection = jasmine.createSpy('getDOMSelection').and.returnValue(null);
        hasFocus = jasmine.createSpy('hasFocus');

        core = ({
            api: {
                addUndoSnapshot,
                createContentModel,
                setContentModel,
                cacheContentModel,
                getFocusedPosition,
                triggerEvent,
                getDOMSelection,
            },
            lifecycle: {},
            cache: {},
            undo: {
                snapshotsManager: {},
            },
            domHelper: {
                hasFocus,
            },
        } as any) as EditorCore;
    });

    describe('Editor has focus', () => {
        beforeEach(() => {
            hasFocus.and.returnValue(true);
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
            expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, undefined);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
                },
                true
            );
        });

        it('Skip undo snapshot', () => {
            const callback = jasmine.createSpy('callback').and.callFake((model, context) => {
                context.skipUndoSnapshot = true;
                return true;
            });

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
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, undefined);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: 'TEST',
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: 'TEST',
                    data: returnData,
                    formatApiName: apiName,
                    changedEntities: [],
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
            expect(setContentModel).toHaveBeenCalledWith(
                core,
                mockedModel,
                undefined,
                onNodeCreated
            );
            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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

            expect(triggerEvent).toHaveBeenCalledTimes(1);
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [
                        {
                            entity: entity1,
                            operation: 'removeFromStart',
                            rawEvent: 'RawEvent',
                        },
                        {
                            entity: entity2,
                            operation: 'removeFromEnd',
                            rawEvent: 'RawEvent',
                        },
                    ],
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
            const transformColorSpy = spyOn(transformColor, 'transformColor');
            const mockedData = 'DATA';

            core.lifecycle.isDarkMode = true;

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
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: mockedData,
                    formatApiName: apiName,
                    changedEntities: [
                        {
                            entity: entity1,
                            operation: 'newEntity',
                            rawEvent: 'RawEvent',
                        },
                        {
                            entity: entity2,
                            operation: 'newEntity',
                            rawEvent: 'RawEvent',
                        },
                    ],
                },
                true
            );
            expect(transformColorSpy).not.toHaveBeenCalled();
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
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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
            core.api.getVisibleViewport = getVisibleViewportSpy;

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
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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
                    eventType: 'contentChanged',
                    contentModel: undefined,
                    selection: undefined,
                    source: ChangeSource.Format,
                    data: undefined,
                    formatApiName: apiName,
                    changedEntities: [],
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

    describe('Editor does not have focus', () => {
        it('Editor did not have focus, do not focus back', () => {
            hasFocus.and.returnValue(false);

            formatContentModel(
                core,
                (model, context) => {
                    return true;
                },
                {
                    apiName,
                }
            );

            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalledWith(
                core,
                mockedModel,
                {
                    ignoreSelection: true,
                },
                undefined
            );
            expect(triggerEvent).toHaveBeenCalled();
            expect(core.cache).toEqual({});
        });
    });

    describe('Pending format', () => {
        const mockedStartContainer1 = 'CONTAINER1' as any;
        const mockedStartOffset1 = 'OFFSET1' as any;
        const mockedFormat1: ContentModelSegmentFormat = { fontSize: '10pt' };

        const mockedStartContainer2 = 'CONTAINER2' as any;
        const mockedStartOffset2 = 'OFFSET2' as any;
        const mockedFormat2: ContentModelSegmentFormat = { fontFamily: 'Arial' };

        beforeEach(() => {
            hasFocus.and.returnValue(true);

            core.format = {
                defaultFormat: {},
                pendingFormat: null,
            };

            const mockedRange = {
                type: 'range',
                range: {
                    collapsed: true,
                    startContainer: mockedStartContainer2,
                    startOffset: mockedStartOffset2,
                },
            } as any;

            core.api.setContentModel = () => mockedRange;
            core.api.getDOMSelection = () => mockedRange;
        });

        it('No pending format, callback returns true, preserve pending format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return true;
            });

            expect(core.format.pendingFormat).toBeNull();
        });

        it('No pending format, callback returns false, preserve pending format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return false;
            });

            expect(core.format.pendingFormat).toBeNull();
        });

        it('Has pending format, callback returns true, preserve pending format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            } as any);
        });

        it('Has pending format, callback returns false, preserve pending format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            } as any);
        });

        it('No pending format, callback returns true, new format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            });
        });

        it('No pending format, callback returns false, new format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            });
        });

        it('Has pending format, callback returns true, new format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            });
        });

        it('Has pending format, callback returns false, new format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                posContainer: mockedStartContainer2,
                posOffset: mockedStartOffset2,
            });
        });

        it('Has pending format, callback returns false, preserve format, selection is not collapsed', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            };

            core.api.getDOMSelection = () =>
                ({
                    type: 'range',
                    range: {
                        collapsed: false,
                        startContainer: mockedStartContainer2,
                        startOffset: mockedStartOffset2,
                    },
                } as any);

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                posContainer: mockedStartContainer1,
                posOffset: mockedStartOffset1,
            });
        });
    });

    describe('Undo snapshot related logic', () => {
        beforeEach(() => {
            hasFocus.and.returnValue(true);
        });

        it('trigger addUndoSnapshot when hasNewContent', () => {
            core.undo.snapshotsManager.hasNewContent = true;

            const callback = jasmine.createSpy('callback').and.returnValue(true);

            formatContentModel(core, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, undefined);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, undefined);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(core.undo).toEqual({
                snapshotsManager: {
                    hasNewContent: true,
                },
                isNested: false,
            } as any);
        });

        it('trigger addUndoSnapshot when has entityStates', () => {
            const mockedEntityState = 'STATE' as any;
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: ContentModelDocument, context: FormatContentModelContext) => {
                    context.entityStates = mockedEntityState;
                    return true;
                });

            formatContentModel(core, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, mockedEntityState);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, mockedEntityState);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(core.undo).toEqual({
                isNested: false,
                snapshotsManager: {},
            } as any);
        });

        it('trigger addUndoSnapshot when has canUndoByBackspace', () => {
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: ContentModelDocument, context: FormatContentModelContext) => {
                    context.canUndoByBackspace = true;
                    return true;
                });

            formatContentModel(core, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, true, undefined);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(core.undo).toEqual({
                isNested: false,
                snapshotsManager: {},
            } as any);
        });

        it('trigger addUndoSnapshot when has canUndoByBackspace and has valid range selection', () => {
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: ContentModelDocument, context: FormatContentModelContext) => {
                    context.canUndoByBackspace = true;
                    return true;
                });

            setContentModel.and.returnValue({
                type: 'range',
                range: {
                    startContainer: mockedContainer,
                    startOffset: mockedOffset,
                },
            });

            formatContentModel(core, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalledTimes(2);
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, true, undefined);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(core.undo).toEqual({
                isNested: false,
                snapshotsManager: {},
                posContainer: mockedContainer,
                posOffset: mockedOffset,
            } as any);
        });

        it('Do not trigger addUndoSnapshot when isNested', () => {
            core.undo.isNested = true;

            const callback = jasmine.createSpy('callback').and.returnValue(true);

            formatContentModel(core, callback);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalledTimes(0);
            expect(setContentModel).toHaveBeenCalledTimes(1);
            expect(setContentModel).toHaveBeenCalledWith(core, mockedModel, undefined, undefined);
            expect(core.undo).toEqual({
                isNested: true,
                snapshotsManager: {
                    hasNewContent: true,
                },
            } as any);
        });
    });
});
