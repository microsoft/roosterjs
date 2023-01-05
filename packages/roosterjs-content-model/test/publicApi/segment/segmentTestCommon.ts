import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IExperimentalContentModelEditor } from '../../../lib/publicTypes/IExperimentalContentModelEditor';

export function segmentTestCommon(
    apiName: string,
    executionCallback: (editor: IExperimentalContentModelEditor) => void,
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
        getCurrentContentModel: (): ContentModelDocument | null => null,
        setCurrentContentModel: () => {},
    } as any) as IExperimentalContentModelEditor;

    executionCallback(editor);

    expect(addUndoSnapshot).toHaveBeenCalledTimes(calledTimes);
    expect(setContentModel).toHaveBeenCalledTimes(calledTimes);
    expect(model).toEqual(result);
}
