import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource } from 'roosterjs-editor-types';
import { createContentModelDocument } from '../../modelApi/creators/createContentModelDocument';
import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { createTableStructure } from '../../modelApi/table/createTableStructure';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { preprocessEntitiesFromContentModel } from 'roosterjs-editor-dom';
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
    editor: IExperimentalContentModelEditor,
    columns: number,
    rows: number,
    format?: TableMetadataFormat
) {
    const doc = createContentModelDocument(editor.getDocument());
    const table = createTableStructure(doc, columns, rows);

    normalizeTable(table);
    applyTableFormat(table, format);

    const firstBlock = table.cells[0]?.[0]?.blocks[0];

    if (firstBlock?.blockType == 'Paragraph') {
        firstBlock.segments.unshift(createSelectionMarker());
    }

    editor.addUndoSnapshot(
        () => {
            editor.setContentModel(doc, {
                mergingCallback: (fragment, _, entityPairs) => {
                    preprocessEntitiesFromContentModel(entityPairs);
                    editor.insertNode(fragment);
                },
            });
        },
        ChangeSource.Format,
        false /*canUndoByBackspace*/,
        { formatApiName: 'insertTable' }
    );
}
