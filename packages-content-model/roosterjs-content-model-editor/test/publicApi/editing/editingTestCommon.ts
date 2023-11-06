import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../../../lib/publicTypes/parameter/FormatWithContentModelContext';

export function editingTestCommon(
    apiName: string,
    executionCallback: (editor: IContentModelEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    spyOn(pendingFormat, 'setPendingFormat');
    spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

    const triggerPluginEvent = jasmine.createSpy('triggerPluginEvent');

    let formatResult: boolean | undefined;

    const formatContentModel = jasmine
        .createSpy('formatContentModel')
        .and.callFake((callback: ContentModelFormatter, options: FormatWithContentModelOptions) => {
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
