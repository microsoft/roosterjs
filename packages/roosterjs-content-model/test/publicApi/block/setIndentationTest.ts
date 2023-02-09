import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as setModelIndentation from '../../../lib/modelApi/block/setModelIndentation';
import setIndentation from '../../../lib/publicApi/block/setIndentation';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('setIndentation', () => {
    const fakeModel: any = { a: 'b' };
    let editor: IContentModelEditor;

    beforeEach(() => {
        editor = ({
            createContentModel: () => fakeModel,
        } as any) as IContentModelEditor;
    });

    it('indent', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(setModelIndentation, 'setModelIndentation');

        setIndentation(editor, 'indent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledWith(
            fakeModel,
            'indent',
            undefined
        );
    });

    it('outdent', () => {
        spyOn(formatWithContentModel, 'formatWithContentModel').and.callThrough();
        spyOn(setModelIndentation, 'setModelIndentation');

        setIndentation(editor, 'outdent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledTimes(1);
        expect(setModelIndentation.setModelIndentation).toHaveBeenCalledWith(
            fakeModel,
            'outdent',
            undefined
        );
    });
});
