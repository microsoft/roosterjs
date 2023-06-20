import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleBullet from '../../../lib/publicApi/list/toggleBullet';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('toggleBullet', () => {
    let editor = ({} as any) as IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;

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
            getCustomData: () => ({}),
            getFocusedPosition: () => ({}),
        } as any) as IContentModelEditor;

        spyOn(setListType, 'setListType').and.returnValue(true);
    });

    it('toggleBullet', () => {
        toggleBullet(editor);

        expect(setListType.setListType).toHaveBeenCalledTimes(1);
        expect(setListType.setListType).toHaveBeenCalledWith(mockedModel, 'UL');
    });
});
