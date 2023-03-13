import * as clearModelFormat from '../../../lib/modelApi/common/clearModelFormat';
import * as formatWithContentModel from '../../../lib/publicApi/utils/formatWithContentModel';
import * as normalizeContentModel from '../../../lib/modelApi/common/normalizeContentModel';
import clearFormat from '../../../lib/publicApi/format/clearFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

describe('clearFormat', () => {
    it('Clear format', () => {
        const editor = ({} as any) as IContentModelEditor;
        const model = ('Model' as any) as ContentModelDocument;

        spyOn(formatWithContentModel, 'formatWithContentModel').and.callFake(
            (_, apiName, callback) => {
                expect(apiName).toEqual('clearFormat');
                callback(model);
            }
        );
        spyOn(clearModelFormat, 'clearModelFormat');
        spyOn(normalizeContentModel, 'normalizeContentModel');

        clearFormat(editor);
        expect(formatWithContentModel.formatWithContentModel).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledWith(model, [], [], []);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(model);
    });
});
