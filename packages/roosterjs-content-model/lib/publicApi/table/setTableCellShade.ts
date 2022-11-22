import hasSelectionInBlockGroup from '../selection/hasSelectionInBlockGroup';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setTableCellBackgroundColor } from '../../modelApi/table/setTableCellBackgroundColor';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set
 */
export default function setTableCellShade(editor: IContentModelEditor, color: string) {
    formatWithContentModel(editor, 'setTableCellShade', model => {
        const table = getFirstSelectedTable(model);

    if (tableModel?.blockType == 'Table') {
        normalizeTable(tableModel);
        setTableCellBackgroundColor(tableModel, color);
        editor.addUndoSnapshot(
            () => {
                editor.focus();
                if (model && table) {
                    editor.setContentModel(model, {
                        doNotReuseEntityDom: true,
                        mergingCallback: fragment => {
                            editor.replaceNode(table, fragment);
                        },
                    });
                }
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            {
                formatApiName: 'setTableCellShade',
            }
        );
    }
}
