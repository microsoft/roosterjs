import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as setListType from '../../../lib/modelApi/list/setListType';
import toggleNumbering from '../../../lib/publicApi/list/toggleNumbering';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';

describe('toggleNumbering', () => {
    let editor = ({} as any) as IContentModelEditor;
    let focus: jasmine.Spy;
    let mockedModel: ContentModelDocument;

    beforeEach(() => {
        mockedModel = ({} as any) as ContentModelDocument;

        focus = jasmine.createSpy('focus');

        spyOn(pendingFormat, 'formatAndKeepPendingFormat').and.callFake(
            (editor, formatter, options) => {
                editor.formatContentModel(formatter, options);
            }
        );

        const formatContentModel = jasmine
            .createSpy('formatContentModel')
            .and.callFake(
                (callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
                    callback(mockedModel, {
                        newEntities: [],
                        deletedEntities: [],
                        newImages: [],
                        rawEvent: options.rawEvent,
                    });
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
    });
});
