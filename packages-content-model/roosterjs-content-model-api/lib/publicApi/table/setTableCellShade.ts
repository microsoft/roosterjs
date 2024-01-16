import {
    hasSelectionInBlockGroup,
    getFirstSelectedTable,
    normalizeTable,
    setTableCellBackgroundColor,
} from 'roosterjs-content-model-core';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Set table cell shade color
 * @param editor The editor instance
 * @param color The color to set. Pass null to remove existing shade color
 */
export default function setTableCellShade(editor: IStandaloneEditor, color: string | null) {
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
