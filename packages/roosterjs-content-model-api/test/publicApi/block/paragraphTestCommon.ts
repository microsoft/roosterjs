import { IEditor } from 'roosterjs-content-model-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelOptions,
} from 'roosterjs-content-model-types';

export function paragraphTestCommon(
    apiName: string,
    executionCallback: (editor: IEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    let formatResult: boolean | undefined;
    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
            });
        });
    const editor = ({
        focus: jasmine.createSpy(),
        getFocusedPosition: () => ({}),
        formatContentModel,
    } as any) as IEditor;

    executionCallback(editor);

    expect(model).toEqual(result);
    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
    expect(model).toEqual(result);
}
