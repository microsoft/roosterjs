import * as scrollCaretIntoView from '../../../lib/coreApi/formatContentModel/scrollCaretIntoView';
import * as transformColor from 'roosterjs-content-model-dom/lib/domUtils/style/transformColor';
import { ChangeSource, createImage } from 'roosterjs-content-model-dom';
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
    let getClientWidth: jasmine.Spy;
    let announce: jasmine.Spy;

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
        getClientWidth = jasmine.createSpy('getClientWidth');
        announce = jasmine.createSpy('announce');

        core = ({
            api: {
                addUndoSnapshot,
                createContentModel,
                setContentModel,
                cacheContentModel,
                getFocusedPosition,
                triggerEvent,
                getDOMSelection,
                announce,
            },
            lifecycle: {},
            cache: {},
            undo: {
                snapshotsManager: {},
            },
            domHelper: {
                hasFocus,
                getClientWidth,
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
        });

        it('With domToModelOptions', () => {
            const options = 'Options' as any;

            formatContentModel(
                core,
                () => true,
                {
                    apiName,
                },
                options
            );

            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(createContentModel).toHaveBeenCalledWith(core, options, undefined);
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
            expect(announce).not.toHaveBeenCalled();
        });

        it('Has image', () => {
            const image = createImage('test');
            const rawEvent = 'RawEvent' as any;

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

            expect(getClientWidth).toHaveBeenCalledTimes(1);
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
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
            expect(announce).not.toHaveBeenCalled();
        });

        it('Has scrollCaretIntoView, and callback return true', () => {
            const scrollCaretIntoViewSpy = spyOn(scrollCaretIntoView, 'scrollCaretIntoView');
            const mockedImage = 'IMAGE' as any;

            setContentModel.and.returnValue({
                type: 'image',
                image: mockedImage,
            });

            formatContentModel(
                core,
                (model, context) => {
                    context.clearModelCache = true;
                    return true;
                },
                {
                    scrollCaretIntoView: true,
                    apiName,
                }
            );

            expect(scrollCaretIntoViewSpy).toHaveBeenCalledWith(core, {
                type: 'image',
                image: mockedImage,
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
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                paragraphFormat: undefined,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            } as any);
        });

        it('Has pending format, callback returns true, preserve paragraph pending format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingParagraphFormat = 'preserve';
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: undefined,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            } as any);
        });

        it('Has pending format, callback returns true, preserve both pending format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                context.newPendingParagraphFormat = 'preserve';
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            } as any);
        });

        it('Has pending format, callback returns false, preserve both pending format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = 'preserve';
                context.newPendingParagraphFormat = 'preserve';
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat1,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            } as any);
        });

        it('No pending format, callback returns true, new format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                paragraphFormat: undefined,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('No pending format, callback returns true, new paragraph format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingParagraphFormat = mockedFormat2;
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: undefined,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('No pending format, callback returns false, new format', () => {
            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                paragraphFormat: undefined,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('Has pending format, callback returns true, new format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return true;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                paragraphFormat: undefined,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('Has pending format, callback returns false, new format', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingFormat = mockedFormat2;
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: mockedFormat2,
                paragraphFormat: undefined,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('Has pending format, callback returns false, new paragraph format', () => {
            core.format.pendingFormat = {
                paragraphFormat: mockedFormat1,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
            };

            formatContentModel(core, (model, context) => {
                context.newPendingParagraphFormat = mockedFormat2;
                return false;
            });

            expect(core.format.pendingFormat).toEqual({
                format: undefined,
                paragraphFormat: mockedFormat2,
                insertPoint: {
                    node: mockedStartContainer2,
                    offset: mockedStartOffset2,
                },
            });
        });

        it('Has pending format, callback returns false, preserve format, selection is not collapsed', () => {
            core.format.pendingFormat = {
                format: mockedFormat1,
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
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
                insertPoint: {
                    node: mockedStartContainer1,
                    offset: mockedStartOffset1,
                },
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
            expect(addUndoSnapshot).toHaveBeenCalledWith(core, false, undefined);
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
                autoCompleteInsertPoint: {
                    node: mockedContainer,
                    offset: mockedOffset,
                },
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

    describe('Has announce data', () => {
        it('callback returns false', () => {
            const mockedData = 'ANNOUNCE' as any;
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: ContentModelDocument, context: FormatContentModelContext) => {
                    context.announceData = mockedData;
                    return false;
                });

            formatContentModel(core, callback, { apiName });

            expect(addUndoSnapshot).not.toHaveBeenCalled();
            expect(setContentModel).not.toHaveBeenCalled();
            expect(triggerEvent).not.toHaveBeenCalled();
            expect(announce).toHaveBeenCalledWith(core, mockedData);
        });

        it('callback returns true', () => {
            const mockedData = 'ANNOUNCE' as any;
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: ContentModelDocument, context: FormatContentModelContext) => {
                    context.announceData = mockedData;
                    return true;
                });

            formatContentModel(core, callback, { apiName });

            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalled();
            expect(triggerEvent).toHaveBeenCalled();
            expect(announce).toHaveBeenCalledWith(core, mockedData);
        });
    });

    describe('Changed entities', () => {
        it('Callback return true, changed entities are not specified', () => {
            const callback = jasmine.createSpy('callback').and.returnValue(true);

            formatContentModel(core, callback, { apiName });

            expect(callback).toHaveBeenCalledWith(mockedModel, {
                newEntities: [],
                deletedEntities: [],
                rawEvent: undefined,
                newImages: [],
            });
            expect(createContentModel).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalled();
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: 'Format',
                    data: undefined,
                    formatApiName: 'mockedApi',
                    changedEntities: [],
                },
                true
            );
        });

        it('Callback return true, changed entities are specified', () => {
            const wrapper1 = document.createElement('span');
            const wrapper2 = document.createElement('div');
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: any, context: FormatContentModelContext) => {
                    context.newEntities.push({
                        segmentType: 'Entity',
                        blockType: 'Entity',
                        entityFormat: {
                            entityType: 'test',
                        },
                        format: {},
                        wrapper: wrapper1,
                    });
                    context.deletedEntities.push({
                        entity: {
                            segmentType: 'Entity',
                            blockType: 'Entity',
                            entityFormat: {
                                entityType: 'test',
                            },
                            format: {},
                            wrapper: wrapper2,
                        },
                        operation: 'overwrite',
                    });
                    return true;
                });

            formatContentModel(core, callback, { apiName });

            expect(callback).toHaveBeenCalled();
            expect(createContentModel).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalled();
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: 'Format',
                    data: undefined,
                    formatApiName: 'mockedApi',
                    changedEntities: [
                        {
                            entity: {
                                segmentType: 'Entity',
                                blockType: 'Entity',
                                entityFormat: { entityType: 'test' },
                                format: {},
                                wrapper: wrapper1,
                            },
                            operation: 'newEntity',
                            rawEvent: undefined,
                        },
                        {
                            entity: {
                                segmentType: 'Entity',
                                blockType: 'Entity',
                                entityFormat: { entityType: 'test' },
                                format: {},
                                wrapper: wrapper2,
                            },
                            operation: 'overwrite',
                            rawEvent: undefined,
                        },
                    ],
                },
                true
            );
        });

        it('Callback return true, auto detect entity change', () => {
            const callback = jasmine
                .createSpy('callback')
                .and.callFake((model: any, context: FormatContentModelContext) => {
                    context.autoDetectChangedEntities = true;
                    return true;
                });

            formatContentModel(core, callback, { apiName });

            expect(callback).toHaveBeenCalled();
            expect(createContentModel).toHaveBeenCalledTimes(1);
            expect(addUndoSnapshot).toHaveBeenCalled();
            expect(setContentModel).toHaveBeenCalled();
            expect(triggerEvent).toHaveBeenCalledWith(
                core,
                {
                    eventType: 'contentChanged',
                    contentModel: mockedModel,
                    selection: mockedSelection,
                    source: 'Format',
                    data: undefined,
                    formatApiName: 'mockedApi',
                    changedEntities: undefined,
                },
                true
            );
        });
    });
});
