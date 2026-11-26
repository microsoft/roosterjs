import { setModelListLevel } from '../../modelApi/list/setModelListLevel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set selected paragraphs or list items to be a list of the given type, and set their list level
 * - Paragraphs that are not in a list will be converted into list items of the given type
 * - List items will be indented or outdented so that they have exactly the given number of levels
 * @param editor The editor to operate on
 * @param listType The list type to set, OL for numbering list, UL for bullet list
 * @param level The target list level, 1 based. 1 means top level list, 2 means first sub list, and so on.
 */
export function setListLevel(editor: IEditor, listType: 'OL' | 'UL', level: number) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            return setModelListLevel(model, listType, level, context);
        },
        {
            apiName: 'setListLevel',
        }
    );
}
