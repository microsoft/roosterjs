import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleNumbering from '../../../lib/publicApi/list/toggleNumbering';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelContext,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';

describe('toggleNumbering', () => {
    let editor = ({} as any) as IContentModelEditor;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let context: FormatWithContentModelContext;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        context = undefined!;
        focus = jasmine.createSpy('focus');

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    context = {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    };
                    callback(mockedModel, context);
                }
            );

        editor = ({
            focus,
            formatContentModel,
        } as any) as IContentModelEditor;

        spyOn(setListType, 'setListType').and.returnValue(true);
    });

    it('toggleNumbering', () => {
        toggleNumbering(editor);

        expect(setListType.setListType).toHaveBeenCalledTimes(1);
        expect(setListType.setListType).toHaveBeenCalledWith(mockedModel, 'OL');
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            rawEvent: undefined,
            newPendingFormat: 'preserve',
        });
    });
});
