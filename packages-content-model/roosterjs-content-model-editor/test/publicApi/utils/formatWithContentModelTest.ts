import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ChangeSource, EntityOperation, PluginEventType } from 'roosterjs-editor-types';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { formatWithContentModel } from '../../../lib/publicApi/utils/formatWithContentModel';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('formatWithContentModel', () => {
    let editor: IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let cacheContentModel: jasmine.Spy;
    let getFocusedPosition: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;

    const apiName = 'mockedApi';
    const mockedPos = 'POS' as any;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');
        cacheContentModel = jasmine.createSpy('cacheContentModel');
        getFocusedPosition = jasmine.createSpy('getFocusedPosition').and.returnValue(mockedPos);
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            cacheContentModel,
            getFocusedPosition,
            triggerPluginEvent,
            isDarkMode: () => false,
        } as any) as IContentModelEditor;
    });

    it('Callback return false', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(false);

        formatWithContentModel(editor, apiName, callback);

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).not.toHaveBeenCalled();
        expect(focus).toHaveBeenCalled();
    });

    it('Callback return true', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatWithContentModel(editor, apiName, callback);

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(undefined);
        expect(addUndoSnapshot.calls.argsFor(0)[2]).toBe(false);
        expect(addUndoSnapshot.calls.argsFor(0)[3]).toEqual({
            formatApiName: apiName,
        });
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, undefined, undefined);
        expect(focus).toHaveBeenCalledTimes(1);
    });

    it('Preserve pending format', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const mockedFormat = 'FORMAT' as any;

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(mockedFormat);
        spyOn(pendingFormat, 'setPendingFormat');

        formatWithContentModel(editor, apiName, callback, {
            preservePendingFormat: true,
        });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(undefined!);
        expect(addUndoSnapshot.calls.argsFor(0)[2]).toBe(false);
        expect(addUndoSnapshot.calls.argsFor(0)[3]).toEqual({
            formatApiName: apiName,
        });
        expect(pendingFormat.setPendingFormat).toHaveBeenCalledTimes(1);
        expect(pendingFormat.setPendingFormat).toHaveBeenCalledWith(
            editor,
            mockedFormat,
            mockedPos
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

        formatWithContentModel(editor, apiName, callback);

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            skipUndoSnapshot: true,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('Customize change source', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatWithContentModel(editor, apiName, callback, { changeSource: 'TEST' });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(undefined!);
        expect(triggerPluginEvent).toHaveBeenCalled();
    });

    it('Customize change source and skip undo snapshot', () => {
        const callback = jasmine.createSpy('callback').and.callFake((model, context) => {
            context.skipUndoSnapshot = true;
            return true;
        });
        formatWithContentModel(editor, apiName, callback, {
            changeSource: 'TEST',
            getChangeData: () => 'DATA',
        });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
            skipUndoSnapshot: true,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('Has onNodeCreated', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        formatWithContentModel(editor, apiName, callback, { onNodeCreated: onNodeCreated });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, undefined, onNodeCreated);
    });

    it('Has getChangeData', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const mockedData = 'DATA' as any;
        const getChangeData = jasmine.createSpy('getChangeData').and.returnValue(mockedData);

        formatWithContentModel(editor, apiName, callback, { getChangeData });

        expect(callback).toHaveBeenCalledWith(mockedModel, {
            newEntities: [],
            deletedEntities: [],
            rawEvent: undefined,
        });
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, undefined, undefined);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(getChangeData).toHaveBeenCalled();
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

        formatWithContentModel(
            editor,
            apiName,
            (model, context) => {
                context.deletedEntities.push(
                    {
                        entity: entity1,
                        operation: EntityOperation.RemoveFromStart,
                    },
                    {
                        entity: entity2,
                        operation: EntityOperation.RemoveFromEnd,
                    }
                );
                return true;
            },
            {
                rawEvent: rawEvent,
            }
        );

        expect(triggerPluginEvent).toHaveBeenCalledTimes(3);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            entity: { id: 'E1', type: 'E', isReadonly: true, wrapper: entity1.wrapper },
            operation: EntityOperation.RemoveFromStart,
            rawEvent: rawEvent,
        });
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.EntityOperation, {
            entity: { id: 'E2', type: 'E', isReadonly: true, wrapper: entity2.wrapper },
            operation: EntityOperation.RemoveFromEnd,
            rawEvent: rawEvent,
        });
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

        editor.isDarkMode = () => true;
        editor.transformToDarkColor = transformToDarkColorSpy;

        formatWithContentModel(
            editor,
            apiName,
            (model, context) => {
                context.newEntities.push(entity1, entity2);
                return true;
            },
            {
                rawEvent: rawEvent,
                getChangeData: () => mockedData,
            }
        );

        expect(triggerPluginEvent).toHaveBeenCalledTimes(1);
        expect(triggerPluginEvent).toHaveBeenCalledWith(PluginEventType.ContentChanged, {
            contentModel: mockedModel,
            selection: undefined,
            source: ChangeSource.Format,
            data: mockedData,
            additionalData: {
                formatApiName: apiName,
            },
        });
        expect(transformToDarkColorSpy).toHaveBeenCalledTimes(2);
        expect(transformToDarkColorSpy).toHaveBeenCalledWith(wrapper1);
        expect(transformToDarkColorSpy).toHaveBeenCalledWith(wrapper2);
    });

    it('With selectionOverride', () => {
        const range = 'MockedRangeEx' as any;

        formatWithContentModel(editor, apiName, () => true, {
            selectionOverride: range,
        });

        expect(createContentModel).toHaveBeenCalledWith(undefined, range);
    });
});
