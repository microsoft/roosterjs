import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';

export function paragraphTestCommon(
    apiName: string,
    executionCallback: (editor: IContentModelEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    const addUndoSnapshot = jasmine
        .createSpy()
        .and.callFake((callback: () => void, source: string, canUndoByBackspace, param: any) => {
            expect(source).toBe('Format');
            expect(param.formatApiName).toBe(apiName);
            callback();
        });
    const setContentModel = jasmine.createSpy().and.callFake((model: ContentModelDocument) => {
        expect(model).toEqual(result);
    });
    const editor = ({
        createContentModel: () => model,
        addUndoSnapshot,
        focus: jasmine.createSpy(),
        setContentModel,
        getCustomData: () => ({}),
        getFocusedPosition: () => ({}),
    } as any) as IContentModelEditor;

    executionCallback(editor);

    expect(addUndoSnapshot).toHaveBeenCalledTimes(calledTimes);
    expect(setContentModel).toHaveBeenCalledTimes(calledTimes);
    expect(model).toEqual(result);
}
