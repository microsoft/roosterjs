import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleNumbering from '../../../lib/publicApi/list/toggleNumbering';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('toggleNumbering', () => {
    let editor = ({} as any) as IContentModelEditor;
    let addUndoSnapshot: jasmine.Spy;
    let createContentModel: jasmine.Spy;
    let setContentModel: jasmine.Spy;
    let triggerPluginEvent: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let getVisibleViewport: jasmine.Spy;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        addUndoSnapshot = jasmine.createSpy('addUndoSnapshot').and.callFake(callback => callback());
        createContentModel = jasmine.createSpy('createContentModel').and.returnValue(mockedModel);
        setContentModel = jasmine.createSpy('setContentModel');
        triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');
        focus = jasmine.createSpy('focus');
        getVisibleViewport = jasmine.createSpy('getVisibleViewport');

        editor = ({
            focus,
            addUndoSnapshot,
            createContentModel,
            setContentModel,
            getCustomData: () => ({}),
            getFocusedPosition: () => ({}),
            isDarkMode: () => false,
            triggerPluginEvent,
            getVisibleViewport,
        } as any) as IContentModelEditor;

        spyOn(setListType, 'setListType').and.returnValue(true);
    });

    it('toggleNumbering', () => {
        toggleNumbering(editor);

        expect(setListType.setListType).toHaveBeenCalledTimes(1);
        expect(setListType.setListType).toHaveBeenCalledWith(mockedModel, 'OL');
    });
});
