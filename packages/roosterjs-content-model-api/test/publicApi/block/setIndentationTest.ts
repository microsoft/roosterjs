import * as setModelIndentation from '../../../lib/modelApi/block/setModelIndentation';
import { ContentModelFormatter, FormatContentModelContext } from 'roosterjs-content-model-types';
import { IEditor } from 'roosterjs-content-model-types';
import { setIndentation } from '../../../lib/publicApi/block/setIndentation';

describe('setIndentation', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IEditor;
    let formatContentModelSpy: jasmine.Spy;
    let context: FormatContentModelContext;

    beforeEach(() => {
        context = undefined!;
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter) => {
                context = {
                    newEntities: [],
                    newImages: [],
                    deletedEntities: [],
                };
                callback(fakeModel, context);
            });

        editor = ({
            formatContentModel: formatContentModelSpy,
            focus: jasmine.createSpy('focus'),
            getPendingFormat: () => null as any,
        } as any) as IEditor;
    });

    it('indent', () => {
        spyOn(setModelIndentation, 'setModelIndentation');

        setIndentation(editor, 'indent');

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledWith(
            fakeModel,
            'indent',
            undefined
        );
        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: 'preserve',
        });
    });

    it('outdent', () => {
        spyOn(setModelIndentation, 'setModelIndentation');

        setIndentation(editor, 'outdent');

        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledWith(
            fakeModel,
            'outdent',
            undefined
        );
        expect(context).toEqual({
            newEntities: [],
            newImages: [],
            deletedEntities: [],
            newPendingFormat: 'preserve',
        });
    });
});
