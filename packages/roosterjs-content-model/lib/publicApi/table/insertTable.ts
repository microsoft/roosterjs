import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { createContentModelDocument } from '../../modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import { deleteSelection } from '../../modelApi/edit/deleteSelection';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getOnDeleteEntityCallback } from '../../editor/utils/handleKeyboardEventCommon';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { mergeModel } from '../../modelApi/common/mergeModel';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setSelection } from '../../modelApi/selection/setSelection';
import { TableMetadataFormat } from '../../publicTypes/format/formatParts/TableMetadataFormat';

/**
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns &lt;= 4, width = 120px; if columns &lt;= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format. If not passed, the default format will be applied:
 * background color: #FFF; border color: #ABABAB
 */
export default function insertTable(
    editor: IContentModelEditor,
    columns: number,
    rows: number,
    format?: TableMetadataFormat
) {
    formatWithContentModel(editor, 'insertTable', model => {
        const onDeleteEntity = getOnDeleteEntityCallback(editor);
        const insertPosition = deleteSelection(model, onDeleteEntity).insertPoint;

        if (insertPosition) {
            const doc = createContentModelDocument();
            const table = createTableStructure(doc, columns, rows);

            normalizeTable(table, getPendingFormat(editor) || insertPosition.marker.format);
            applyTableFormat(table, format);
            mergeModel(model, doc, onDeleteEntity, {
                insertPosition,
                mergeFormat: 'mergeAll',
            });

            const firstBlock = table.rows[0]?.cells[0]?.blocks[0];

            if (firstBlock?.blockType == 'Paragraph') {
                const marker = createSelectionMarker(firstBlock.segments[0]?.format);
                firstBlock.segments.unshift(marker);
                setSelection(model, marker);
            }

            return true;
        } else {
            return false;
        }
    });
}
