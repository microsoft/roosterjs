import { applyTableFormat } from 'roosterjs-content-model-core';
import { getFirstSelectedTable, updateTableCellMetadata } from 'roosterjs-content-model-dom';
import type { IEditor, TableMetadataFormat } from 'roosterjs-content-model-types';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 * @param keepCellShade Whether keep existing shade color when apply format if there is a manually set shade color
 */
export function formatTable(editor: IEditor, format: TableMetadataFormat, keepCellShade?: boolean) {
    editor.focus();

    editor.formatContentModel(
        model => {
            const [tableModel] = getFirstSelectedTable(model);

            if (tableModel) {
                // Wipe border metadata
                tableModel.rows.forEach(row => {
                    row.cells.forEach(cell => {
                        updateTableCellMetadata(cell, metadata => {
                            if (metadata) {
                                delete metadata.borderOverride;
                            }
                            return metadata;
                        });
                    });
                });
                applyTableFormat(tableModel, format, keepCellShade);
                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'formatTable',
        }
    );
}
