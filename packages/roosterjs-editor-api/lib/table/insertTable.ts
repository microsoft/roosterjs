import { createRange, Position, VTable, wrap } from 'roosterjs-editor-dom';
import {
    ChangeSource,
    ContentPosition,
    IEditor,
    PositionType,
    TableFormat,
} from 'roosterjs-editor-types';

const NOT_EDITABLE_SELECTOR = '[contenteditable=false]';

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
    let document = editor.getDocument();
    let fragment = document.createDocumentFragment();
    let table = document.createElement('table') as HTMLTableElement;
    fragment.appendChild(table);
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

    editor.focus();
    editor.addUndoSnapshot(() => {
        let vtable = new VTable(table);
        vtable.applyFormat(format);
        vtable.writeBack();
        editor.insertNode(fragment);

        if (!table.isContentEditable) {
            handleNotEditableTable(table, editor);
        }

        editor.runAsync(editor =>
            editor.select(new Position(table, PositionType.Begin).normalize())
        );
    }, ChangeSource.Format);
}

function handleNotEditableTable(table: HTMLTableElement, editor: IEditor) {
    let nonEditableElement: HTMLElement | undefined;
    let lastNonEditableElement: HTMLElement | undefined = editor.getElementAtCursor(
        NOT_EDITABLE_SELECTOR,
        table
    );

    while (lastNonEditableElement) {
        nonEditableElement = lastNonEditableElement;
        lastNonEditableElement = nonEditableElement.parentElement
            ? editor.getElementAtCursor(NOT_EDITABLE_SELECTOR, nonEditableElement.parentElement)
            : undefined;
    }

    if (nonEditableElement) {
        const afterPosition = new Position(nonEditableElement, PositionType.After);
        const wrapper = wrap(table, 'div');
        const range = createRange(afterPosition);
        editor.insertContent('&nbsp;', {
            position: ContentPosition.Range,
            range,
        });
        editor.insertNode(wrapper, {
            position: ContentPosition.Range,
            range,
        });
    }
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
