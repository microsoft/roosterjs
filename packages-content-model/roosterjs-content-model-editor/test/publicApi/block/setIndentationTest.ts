import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import * as setModelIndentation from '../../../lib/modelApi/block/setModelIndentation';
import setIndentation from '../../../lib/publicApi/block/setIndentation';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('setIndentation', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IContentModelEditor;
    let formatContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: Function) => {
                callback(fakeModel);
            });

        editor = ({
            formatContentModel: formatContentModelSpy,
            focus: jasmine.createSpy('focus'),
        } as any) as IContentModelEditor;

        spyOn(pendingFormat, 'formatAndKeepPendingFormat').and.callFake(
            (editor, formatter, options) => {
                editor.formatContentModel(formatter, options);
            }
        );
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
    });
});
