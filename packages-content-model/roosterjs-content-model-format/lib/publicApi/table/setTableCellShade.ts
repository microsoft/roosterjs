import { hasSelectionInBlockGroup } from '../../modelApi/selection/hasSelectionInBlockGroup';
import {
    getFirstSelectedTable,
    normalizeTable,
    setTableCellBackgroundColor,
} from 'roosterjs-content-model-editor';
import type { IContentModelEditor } from 'roosterjs-content-model-editor';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set. Pass null to remove existing shade color
 */
export function setTableCellShade(editor: IContentModelEditor, color: string | null) {
    editor.focus();

    editor.formatContentModel(
        model => {
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
        },
        {
            apiName: 'setTableCellShade',
        }
    );
}
