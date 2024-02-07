import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleBullet from '../../../lib/publicApi/list/toggleBullet';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('toggleBullet', () => {
    let editor = ({} as any) as IStandaloneEditor;
    let formatContentModel: jasmine.Spy;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;
    let context: FormatContentModelContext;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        context = undefined!;
        formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                context = {
                    newEntities: [],
                    deletedEntities: [],
                    newImages: [],
                    rawEvent: options.rawEvent,
                };
                callback(mockedModel, context);
            });
        focus = jasmine.createSpy('focus');

        editor = ({
            focus,
            formatContentModel,
            getFocusedPosition: () => ({}),
        } as any) as IStandaloneEditor;

        spyOn(setListType, 'setListType').and.returnValue(true);
    });

    it('toggleBullet', () => {
        toggleBullet(editor);

        expect(setListType.setListType).toHaveBeenCalledTimes(1);
        expect(setListType.setListType).toHaveBeenCalledWith(mockedModel, 'UL');
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            rawEvent: undefined,
            newPendingFormat: 'preserve',
        });
    });
});
