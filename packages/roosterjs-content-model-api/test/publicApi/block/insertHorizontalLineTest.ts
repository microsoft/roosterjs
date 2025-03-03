import * as insertHorizontalLineIntoModelFile from '../../../lib/modelApi/block/insertHorizontalLineIntoModel';
import { insertHorizontalLine } from '../../../lib/publicApi/block/insertHorizontalLine';
import {
    ContentModelFormatter,
    DomToModelOptionForCreateModel,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

describe('insertHorizontalLine', () => {
    let editor: IEditor;
    let formatWithContentModelSpy: jasmine.Spy;

    beforeEach(() => {
        formatWithContentModelSpy = jasmine.createSpy('formatWithContentModel');
        const cb = (
            formatter: ContentModelFormatter,
            options?: FormatContentModelOptions,
            domToModelOption?: DomToModelOptionForCreateModel
        ) => {
            formatter((<any>{}) as any, (<any>{}) as any);
            formatWithContentModelSpy(formatter, options, domToModelOption);
        };
        editor = ({
            formatContentModel: cb,
        } as unknown) as IEditor;
        spyOn(insertHorizontalLineIntoModelFile, 'insertHorizontalLineIntoModel').and.callFake(
            () => true
        );
    });

    it('should call formatContentModel with insertHorizontalLineIntoModel', () => {
        insertHorizontalLine(editor);

        expect(formatWithContentModelSpy).toHaveBeenCalledWith(
            jasmine.anything(),
            {
                apiName: 'insertHorizontalLine',
            },
            undefined
        );
        expect(insertHorizontalLineIntoModelFile.insertHorizontalLineIntoModel).toHaveBeenCalled();
    });
});
