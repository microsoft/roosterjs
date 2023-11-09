import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';

export function paragraphTestCommon(
    apiName: string,
    executionCallback: (editor: IContentModelEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    let formatResult: boolean | undefined;
    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
            });
        });
    const editor = ({
        focus: jasmine.createSpy(),
        getCustomData: () => ({}),
        getFocusedPosition: () => ({}),
        formatContentModel,
    } as any) as IContentModelEditor;

    executionCallback(editor);

    expect(model).toEqual(result);
    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
    expect(model).toEqual(result);
}
