import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import setBackgroundColor from '../format/setBackgroundColor';
import { Position, VTable } from 'roosterjs-editor-dom';
import { PositionType } from 'roosterjs-editor-types';
import type { IEditor, TableFormat } from 'roosterjs-editor-types';

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
    editor: IEditor,
    columns: number,
    rows: number,
    format?: TableFormat
) {
    const document = editor.getDocument();
    const table = document.createElement('table') as HTMLTableElement;
    table.cellSpacing = '0';
    table.cellPadding = '1';
    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr') as HTMLTableRowElement;
        table.appendChild(tr);
        for (let j = 0; j < columns; j++) {
            const td = document.createElement('td') as HTMLTableCellElement;
            tr.appendChild(td);
            td.appendChild(document.createElement('br'));
            td.style.width = getTableCellWidth(columns);
        }
    }

    editor.focus();
    formatUndoSnapshot(
        editor,
        () => {
            const element = editor.getElementAtCursor();
            if (element?.style.backgroundColor) {
                setBackgroundColor(editor, 'transparent');
            }
            const vtable = new VTable(table);
            // Assign default vertical align
            format = format || { verticalAlign: 'top' };
            vtable.applyFormat(format || {});
            vtable.writeBack();
            editor.insertNode(table);
            editor.runAsync(editor =>
                editor.select(new Position(table, PositionType.Begin).normalize())
            );
        },
        'insertTable'
    );
}

function getTableCellWidth(columns: number): string {
    if (columns <= 4) {
        return '120px';
    } else if (columns <= 6) {
        return '100px';
    } else {
        return '70px';
    }
}
