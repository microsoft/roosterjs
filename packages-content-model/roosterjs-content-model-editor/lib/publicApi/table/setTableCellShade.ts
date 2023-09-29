import hasSelectionInBlockGroup from '../selection/hasSelectionInBlockGroup';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setTableCellBackgroundColor } from '../../modelApi/table/setTableCellBackgroundColor';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set. Pass null to remove existing shade color
 */
export default function setTableCellShade(editor: IContentModelEditor, color: string | null) {
    formatWithContentModel(editor, 'setTableCellShade', model => {
        const [table] = getFirstSelectedTable(model);

        if (table) {
            normalizeTable(table);

            table.rows.forEach(row =>
                row.cells.forEach(cell => {
                    if (hasSelectionInBlockGroup(cell)) {
                        setTableCellBackgroundColor(cell, color, true /*isColorOverride*/);
                    }
                })
            );

            return true;
        } else {
            return false;
        }
    });
}
