import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import setIndentation from '../../../lib/publicApi/block/setIndentation';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';
import { indent } from '../../../lib/modelApi/block/indent';
import { outdent } from '../../../lib/modelApi/block/outdent';

describe('setIndentation', () => {
    let editor = ({} as any) as IExperimentalContentModelEditor;

    beforeEach(() => {
        spyOn(formatWithContentModel, 'formatWithContentModel');
    });

    it('indent', () => {
        setIndentation(editor, 'indent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledWith(
            editor,
            'setIndentation',
            indent
        );
    });

    it('outdent', () => {
        setIndentation(editor, 'outdent');

        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledWith(
            editor,
            'setIndentation',
            outdent
        );
    });
});
