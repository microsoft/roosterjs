import { Editor } from 'roosterjs-editor-core';
import execFormatWithUndo from './execFormatWithUndo';

const ZERO_WIDTH_SPACE = '&#8203;';

/**
 * The table format
 * @param cellSpacing (Optional) The cellSpacing style for the HTML table element
 * @param cellPadding (Optional) The cellPadding style for the HTML table element
 * @param borderWidth (Optional) The borderWidth style for the HTML table element
 * @param borderStyle (Optional) The borderStyle style for the HTML table element
 * @param borderColor (Optional) The borderColor style for the HTML table element
 * @param borderCollapse (Optional) The borderCollapse style for the HTML table element
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
 * Insert table into editor at current selection
 * @param editor The editor instance
 * @param columns Number of columns in table, it also controls the default table cell width:
 * if columns <= 4, width = 120px; if columns <= 6, width = 100px; else width = 70px
 * @param rows Number of rows in table
 * @param format (Optional) The table format
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
