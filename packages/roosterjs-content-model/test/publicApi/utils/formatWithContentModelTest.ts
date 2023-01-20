import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { ContentModelSegmentFormat } from '../../../lib/publicTypes/format/ContentModelSegmentFormat';
import { formatWithContentModel } from '../../../lib/publicApi/utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

describe('formatWithContentModel', () => {
    let editor: IExperimentalContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;

    const apiName = 'mockedApi';

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            getPendingFormat: (): ContentModelSegmentFormat | null => null,
            setPendingFormat: () => {},
        } as any) as IExperimentalContentModelEditor;
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
        expect(setContentModel).toHaveBeenCalledWith(mockedModel);
        expect(focus).toHaveBeenCalledTimes(1);
    });
});
