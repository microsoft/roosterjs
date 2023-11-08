import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from 'roosterjs-content-model-types';
import { IContentModelEditor } from 'roosterjs-content-model-editor';

export function editingTestCommon(
    apiName: string,
    executionCallback: (editor: IContentModelEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

    let formatResult: boolean | undefined;

    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
            expect(options.apiName).toBe(apiName);
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                rawEvent: options.rawEvent,
            });
        });

    const editor = ({
        triggerPluginEvent,
        getEnvironment: () => ({}),
        formatContentModel,
    } as any) as IContentModelEditor;

    executionCallback(editor);

    expect(model).toEqual(result);
    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
}
