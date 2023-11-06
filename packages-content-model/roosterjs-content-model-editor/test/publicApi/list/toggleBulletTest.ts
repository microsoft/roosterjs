import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleBullet from '../../../lib/publicApi/list/toggleBullet';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';

describe('toggleBullet', () => {
    let editor = ({} as any) as IContentModelEditor;
    let formatContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    callback(mockedModel, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                    });
                }
            );
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            formatContentModel,
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
