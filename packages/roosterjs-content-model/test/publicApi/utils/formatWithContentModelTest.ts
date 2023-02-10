import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
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
    let triggerContentChangedEvent: jasmine.Spy;

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
        triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            cacheContentModel,
            getFocusedPosition,
            triggerContentChangedEvent,
        } as any) as IContentModelEditor;
    });

    it('Callback return false', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(false);

        formatWithContentModel(editor, apiName, callback);

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(setContentModel).not.toHaveBeenCalled();
        expect(focus).not.toHaveBeenCalled();
    });

    it('Callback return true', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatWithContentModel(editor, apiName, callback);

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(ChangeSource.Format);
        expect(addUndoSnapshot.calls.argsFor(0)[2]).toBe(false);
        expect(addUndoSnapshot.calls.argsFor(0)[3]).toEqual({
            formatApiName: apiName,
        });
        expect(setContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, { onNodeCreated: undefined });
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

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe(ChangeSource.Format);
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
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const mockedFormat = 'FORMAT' as any;

        spyOn(pendingFormat, 'getPendingFormat').and.returnValue(mockedFormat);
        spyOn(pendingFormat, 'setPendingFormat');

        formatWithContentModel(editor, apiName, callback, {
            skipUndoSnapshot: true,
        });

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
    });

    it('Customize change source', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatWithContentModel(editor, apiName, callback, { changeSource: 'TEST' });

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(addUndoSnapshot.calls.argsFor(0)[1]).toBe('TEST');
    });

    it('Customize change source and skip undo snapshot', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);

        formatWithContentModel(editor, apiName, callback, {
            changeSource: 'TEST',
            skipUndoSnapshot: true,
            getChangeData: () => 'DATA',
        });

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).not.toHaveBeenCalled();
        expect(triggerContentChangedEvent).toHaveBeenCalledWith('TEST', 'DATA');
    });

    it('Has onNodeCreated', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const onNodeCreated = jasmine.createSpy('onNodeCreated');

        formatWithContentModel(editor, apiName, callback, { onNodeCreated: onNodeCreated });

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(addUndoSnapshot).toHaveBeenCalled();
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, { onNodeCreated });
    });

    it('Has getChangeData', () => {
        const callback = jasmine.createSpy('callback').and.returnValue(true);
        const mockedData = 'DATA' as any;
        const getChangeData = jasmine.createSpy('getChangeData').and.returnValue(mockedData);

        formatWithContentModel(editor, apiName, callback, { getChangeData });

        expect(callback).toHaveBeenCalledWith(mockedModel);
        expect(createContentModel).toHaveBeenCalledTimes(1);
        expect(setContentModel).toHaveBeenCalledWith(mockedModel, { onNodeCreated: undefined });
        expect(addUndoSnapshot).toHaveBeenCalled();

        const wrappedCallback = addUndoSnapshot.calls.argsFor(0)[0] as any;
        const result = wrappedCallback();

        expect(getChangeData).toHaveBeenCalled();
        expect(result).toBe(mockedData);
    });
});
