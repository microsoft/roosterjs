import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatContentModelOptions,
    IEditor,
} from 'roosterjs-content-model-types';

export function editingTestCommon(
    apiName: string,
    executionCallback: (editor: IEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    const triggerEvent = jasmine.createSpy('triggerEvent');

    let formatResult: boolean | undefined;

    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatContentModelOptions) => {
            expect(options.apiName).toBe(apiName);
            formatResult = callback(model, {
                newEntities: [],
                deletedEntities: [],
                newImages: [],
                rawEvent: options.rawEvent,
            });
        });

    const editor = ({
        triggerEvent,
        getEnvironment: () => ({}),
        formatContentModel,
    } as any) as IEditor;

    executionCallback(editor);

    expect(model).toEqual(result);
    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
}
