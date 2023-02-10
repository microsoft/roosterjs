import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { DomToModelOption, IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IContentModelEditor,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    domToModelOptions?: DomToModelOption
) {
    const model = editor.createContentModel(domToModelOptions);

    if (callback(model)) {
        editor.addUndoSnapshot(
            () => {
                editor.focus();
                if (model) {
                    editor.setContentModel(model);
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: apiName,
            }
        );
    }
}
