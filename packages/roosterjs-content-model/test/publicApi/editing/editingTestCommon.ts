import * as pendingFormat from '../../../lib/modelApi/format/pendingFormat';
import { ContentModelDocument } from '../../../lib/publicTypes/group/ContentModelDocument';
import { IContentModelEditor } from '../../../lib/publicTypes/IContentModelEditor';
import { NodePosition } from 'roosterjs-editor-types';

export function editingTestCommon(
    apiName: string,
    executionCallback: (editor: IContentModelEditor) => void,
    model: ContentModelDocument,
    result: ContentModelDocument,
    calledTimes: number
) {
    spyOn(pendingFormat, 'setPendingFormat');
    spyOn(pendingFormat, 'getPendingFormat').and.returnValue(null);

    const triggerContentChangedEvent = jasmine.createSpy('triggerContentChangedEvent');

    const addUndoSnapshot = jasmine
        .createSpy('addUndoSnapshot')
        .and.callFake((callback: () => void, source: string, _, param: any) => {
            expect(source).toBe('Format');
            expect(param.formatApiName).toBe(apiName);
            callback();
        });
    const setContentModel = jasmine
        .createSpy('setContentModel')
        .and.callFake((model: ContentModelDocument) => {
            expect(model).toEqual(result);
        });
    const editor = ({
        createContentModel: () => model,
        addUndoSnapshot,
        focus: jasmine.createSpy(),
        setContentModel,
        isDisposed: () => false,
        getFocusedPosition: () => null as NodePosition,
        triggerContentChangedEvent,
    } as any) as IContentModelEditor;

    executionCallback(editor);

    expect(addUndoSnapshot).toHaveBeenCalledTimes(0); // Should not add undo snapshot since this will be handled by UndoPlugin instead
    expect(setContentModel).toHaveBeenCalledTimes(calledTimes);
    expect(model).toEqual(result);
}
