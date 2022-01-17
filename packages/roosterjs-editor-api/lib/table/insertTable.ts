import { Position, saveTableInfo, VTable } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    IEditor,
    PositionType,
    TableFormat,
} from 'roosterjs-editor-types';

const DEFAULT_FORMAT: Partial<TableFormat> = {
    bgColor: null,
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    headerRow: false,
    firstColumn: false,
    bandedRows: false,
    bandedColumns: false,
    bgColumnColorEven: null,
    bgColumnColorOdd: '#ABABAB20',
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: null,
};

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
    const isInsideTable = editor.getElementAtCursor('td,th');

    let document = editor.getDocument();
    let fragment = document.createDocumentFragment();
    let table = document.createElement('table') as HTMLTableElement;

    table.cellSpacing = '0';
    table.cellPadding = '1';
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr') as HTMLTableRowElement;
        table.appendChild(tr);
        for (let j = 0; j < columns; j++) {
            let td = document.createElement('td') as HTMLTableCellElement;
            tr.appendChild(td);
            td.appendChild(document.createElement('br'));
            td.style.width = getTableCellWidth(columns);
        }
    }
    if (!isInsideTable) {
        let divTableContainer = document.createElement('div');
        divTableContainer.appendChild(table);
        fragment.appendChild(divTableContainer);
        const div = document.createElement('div');
        div.append(document.createElement('br'));
        fragment.append(div);
    } else {
        fragment.appendChild(table);
    }

    editor.focus();
    editor.addUndoSnapshot(() => {
        let vtable = new VTable(table);
        saveTableInfo(table, format || DEFAULT_FORMAT);
        vtable.applyFormat(format || DEFAULT_FORMAT);
        vtable.writeBack();
        if (!isInsideTable) {
            editor.insertNode(fragment, {
                insertOnNewLine: true,
                replaceSelection: true,
                position: ContentPosition.SelectionStart,
                updateCursor: true,
            });
        } else {
            editor.insertNode(fragment);
        }
        editor.runAsync(editor =>
            editor.select(new Position(table, PositionType.Begin).normalize())
        );
    }, ChangeSource.Format);
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
