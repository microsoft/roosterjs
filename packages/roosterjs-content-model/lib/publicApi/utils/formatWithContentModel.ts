import { ChangeSource } from 'roosterjs-editor-types';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import {
    DomToModelOption,
    IExperimentalContentModelEditor,
} from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * @internal
 */
export function formatWithContentModel(
    editor: IExperimentalContentModelEditor,
    apiName: string,
    callback: (model: ContentModelDocument) => boolean,
    domToModelOptions?: DomToModelOption
) {
    const model =
        editor.getCurrentContentModel() ||
        editor.createContentModel(undefined /*rootNode*/, domToModelOptions);

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

        editor.setCurrentContentModel(model);
    }
}
