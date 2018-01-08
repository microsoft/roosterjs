import { Editor } from 'roosterjs-editor-core';
import execFormatWithUndo from './execFormatWithUndo';

const ZERO_WIDTH_SPACE = '&#8203;';

/**
 * The table format
 */
export interface TableFormat {
    cellSpacing?: string;
    cellPadding?: string;
    borderWidth?: string;
    borderStyle?: string;
    borderColor?: string;
    borderCollapse?: string;
}

/**
 * Insert table into editor
 * @param editor The editor instance
 * @param columns Number of columns in table
 * @param rows Number of rows in table
 * @param format The table format
 */
export default function insertTable(
    editor: Editor,
    columns: number,
    rows: number,
    format?: TableFormat
) {
    let document = editor.getDocument();
    let fragment = document.createDocumentFragment();
    let table = document.createElement('table') as HTMLTableElement;
    fragment.appendChild(table);
    table.cellSpacing = (format && format.cellSpacing) || '0';
    table.cellPadding = (format && format.cellPadding) || '0';
    buildBorderStyle(table, format);
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr') as HTMLTableRowElement;
        table.appendChild(tr);
        for (let j = 0; j < columns; j++) {
            let td = document.createElement('td') as HTMLTableCellElement;
            tr.appendChild(td);
            buildBorderStyle(td, format);
            td.style.width = getTableCellWidth(columns);
            td.innerHTML = ZERO_WIDTH_SPACE;
        }
    }

    execFormatWithUndo(editor, () => {
        editor.insertNode(fragment);
    });
}

function buildBorderStyle(node: HTMLElement, format: TableFormat) {
    format = format || {};
    node.style.borderWidth = format.borderWidth || '1px';
    node.style.borderStyle = format.borderStyle || 'solid';
    node.style.borderColor = format.borderColor || '#c6c6c6';
    node.style.borderCollapse = format.borderCollapse || 'collapse';
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
