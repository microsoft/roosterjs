import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { NodePosition } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';

export function segmentTestCommon(
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
            expect(options.apiName).toBe(apiName);
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
            });
        });
    const editor = ({
        focus: jasmine.createSpy(),
        getFocusedPosition: () => null as NodePosition,
        getPendingFormat: () => null as any,
        formatContentModel,
    } as any) as IContentModelEditor;

    executionCallback(editor);

    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
    expect(model).toEqual(result);
}
