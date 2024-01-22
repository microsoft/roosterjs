import {
    ContentModelDocument,
    ContentModelFormatter,
    FormatWithContentModelOptions,
    IStandaloneEditor,
} from 'roosterjs-content-model-types';

export function editingTestCommon(
    apiName: string,
    executionCallback: (editor: IStandaloneEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    const triggerEvent = jasmine.createSpy('triggerEvent');

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
        triggerEvent,
        getEnvironment: () => ({}),
        formatContentModel,
    } as any) as IStandaloneEditor;

    executionCallback(editor);

    expect(model).toEqual(result);
    expect(formatContentModel).toHaveBeenCalledTimes(1);
    expect(formatResult).toBe(calledTimes > 0);
}
