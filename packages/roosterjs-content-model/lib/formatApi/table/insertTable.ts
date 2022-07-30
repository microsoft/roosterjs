import applyTableFormat from './applyTableFormat';
import { addSegment } from '../../domToModel/utils/addSegment';
import { ChangeSource, TableFormat } from 'roosterjs-editor-types';
import { createBr } from '../../domToModel/creators/createBr';
import { createContentModelDocument } from '../../domToModel/creators/createContentModelDocument';
import { createTable } from '../../domToModel/creators/createTable';
import { createTableCell } from '../../domToModel/creators/createTableCell';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

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
    format?: TableFormat
) {
    const context = editor.createFormatContext();
    const doc = createContentModelDocument(editor.getDocument());
    const table = createTable(rows);
    const width = getTableCellWidth(columns);

    doc.blocks.push(table);

    table.format.borderCollapse = true;
    table.cells.forEach(row => {
        for (let i = 0; i < columns; i++) {
            const cell = createTableCell(1 /*colSpan*/, 1 /*rowSpan*/, false /*isHeader*/, context);

            addSegment(cell, createBr(context));
            row.push(cell);

            cell.format.width = width;
        }
    });

    applyTableFormat(table, format);

    const fragment = editor.getDOMFromContentModel(doc);

    editor.addUndoSnapshot(
        () => {
            editor.insertNode(fragment);
        },
        ChangeSource.Format,
        false /*canUndoByBackspace*/,
        {
            formatApiName: 'insertTable',
        }
    );
}

function getTableCellWidth(columns: number): number {
    if (columns <= 4) {
        return 120;
    } else if (columns <= 6) {
        return 100;
    } else {
        return 70;
    }
}
