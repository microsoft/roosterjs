import createDOMFromContentModel from '../../modelToDom/createDOMFromContentModel';
import { addSegment } from '../../domToModel/utils/addSegment';
import { ChangeSource, IEditor, TableFormat } from 'roosterjs-editor-types';
import { createBr } from '../../domToModel/creators/createBr';
import { createContentModelDocument } from '../../domToModel/creators/createContentModelDocument';
import { createFormatContextFromEditor } from '../utils/createFormatContextFromEditor';
import { createTable } from '../../domToModel/creators/createTable';
import { createTableCell } from '../../domToModel/creators/createTableCell';

export default function insertTable(
    editor: IEditor,
    columns: number,
    rows: number,
    format?: TableFormat
) {
    // TODO: Let editor provide Content Model Context
    const context = createFormatContextFromEditor(editor, false /*isRtl*/);
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

            // Temporary set gray border, will do table format later
            cell.format.borderColor = ['gray', 'gray', 'gray', 'gray'];
            cell.format.borderStyle = ['solid', 'solid', 'solid', 'solid'];
            cell.format.borderWidth = ['1px', '1px', '1px', '1px'];
            cell.format.width = width;
        }
    });

    const [fragment] = createDOMFromContentModel(
        doc,
        context.isDarkMode,
        context.zoomScale,
        context.isDarkMode,
        context.getDarkColor
    );

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
