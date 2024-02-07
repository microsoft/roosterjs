import * as clearModelFormat from '../../../lib/modelApi/common/clearModelFormat';
import * as normalizeContentModel from 'roosterjs-content-model-dom/lib/modelApi/common/normalizeContentModel';
import clearFormat from '../../../lib/publicApi/format/clearFormat';
import { IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

describe('clearFormat', () => {
    it('Clear format', () => {
        const model = ('Model' as any) as ContentModelDocument;
        const formatContentModelSpy = jasmine
            .createSpy('formatContentModel')
            .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
                expect(options.apiName).toEqual('clearFormat');
                callback(model, { newEntities: [], deletedEntities: [], newImages: [] });
            });

        const editor = ({
            focus: () => {},
            formatContentModel: formatContentModelSpy,
        } as any) as IStandaloneEditor;

        spyOn(clearModelFormat, 'clearModelFormat');
        spyOn(normalizeContentModel, 'normalizeContentModel');

        clearFormat(editor);
        expect(formatContentModelSpy).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledTimes(1);
        expect(clearModelFormat.clearModelFormat).toHaveBeenCalledWith(model, [], [], []);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledTimes(1);
        expect(normalizeContentModel.normalizeContentModel).toHaveBeenCalledWith(model);
    });
});
