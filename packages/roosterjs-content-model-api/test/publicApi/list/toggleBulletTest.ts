import * as setListType from '../../../lib/modelApi/list/setListType';
import * as setModelListStyle from '../../../lib/modelApi/list/setModelListStyle';
import { BulletListType } from 'roosterjs-content-model-dom';
import { IEditor } from 'roosterjs-content-model-types';
import { toggleBullet } from '../../../lib/publicApi/list/toggleBullet';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelContext,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('toggleBullet', () => {
    let editor = ({} as any) as IEditor;
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
        } as any) as IEditor;

        spyOn(setListType, 'setListType').and.returnValue(true);
        spyOn(setModelListStyle, 'setModelListStyle').and.returnValue(true);
    });

    it('toggleBullet', () => {
        toggleBullet(editor);

        expect(setListType.setListType).toHaveBeenCalledTimes(1);
        expect(setListType.setListType).toHaveBeenCalledWith(
            mockedModel,
            'UL',
            false /** remove margins */
        );
        expect(setModelListStyle.setModelListStyle).toHaveBeenCalledTimes(1);
        expect(setModelListStyle.setModelListStyle).toHaveBeenCalledWith(mockedModel, {
            unorderedStyleType: BulletListType.Disc,
        });
        expect(context).toEqual({
            newEntities: [],
            deletedEntities: [],
            newImages: [],
            rawEvent: undefined,
            newPendingFormat: 'preserve',
        });
    });
});
