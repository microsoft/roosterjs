import { alignTable } from '../../modelApi/table/alignTable';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { formatTableWithContentModel } from '../utils/formatTableWithContentModel';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { shiftCells } from '../../modelApi/table/shiftCells';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';
import type { TableOperation, IEditor } from 'roosterjs-content-model-types';
import {
    alignTableCellHorizontally,
    alignTableCellVertically,
} from '../../modelApi/table/alignTableCell';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param operation The table operation to apply
 */
export function editTable(editor: IEditor, operation: TableOperation) {
    editor.focus();

    fixUpSafariSelection(editor);

    formatTableWithContentModel(editor, 'editTable', tableModel => {
        switch (operation) {
            case 'alignCellLeft':
            case 'alignCellCenter':
            case 'alignCellRight':
                alignTableCellHorizontally(tableModel, operation);
                break;
            case 'alignCellTop':
            case 'alignCellMiddle':
            case 'alignCellBottom':
                alignTableCellVertically(tableModel, operation);
                break;
            case 'alignCenter':
            case 'alignLeft':
            case 'alignRight':
                alignTable(tableModel, operation);
                break;

            case 'deleteColumn':
                deleteTableColumn(tableModel);
                break;

            case 'deleteRow':
                deleteTableRow(tableModel);
                break;

            case 'deleteTable':
                deleteTable(tableModel);
                break;

            case 'insertAbove':
            case 'insertBelow':
                insertTableRow(tableModel, operation);
                break;

            case 'insertLeft':
            case 'insertRight':
                insertTableColumn(tableModel, operation);
                break;

            case 'mergeAbove':
            case 'mergeBelow':
                mergeTableRow(tableModel, operation);
                break;

            case 'mergeCells':
                mergeTableCells(tableModel);
                break;

            case 'mergeLeft':
            case 'mergeRight':
                mergeTableColumn(tableModel, operation);
                break;

            case 'splitHorizontally':
                splitTableCellHorizontally(tableModel);
                break;

            case 'splitVertically':
                splitTableCellVertically(tableModel);
                break;

            case 'shiftCellsUp':
            case 'shiftCellsLeft':
                shiftCells(tableModel, operation);
                break;
        }
    });
}

// In safari, when open context menu under a table, it may expand the range selection to the beginning of next table cell.
// So we make a workaround here to collapse the selection when need, to avoid unexpected table editing behavior
// (e.g. insert two columns but actually need one only)
function fixUpSafariSelection(editor: IEditor) {
    if (editor.getEnvironment().isSafari) {
        const selection = editor.getDOMSelection();

        if (selection?.type == 'range' && !selection.range.collapsed) {
            selection.range.collapse(true /*toStart*/);
            editor.setDOMSelection({
                type: 'range',
                range: selection.range,
                isReverted: false,
            });
        }
    }
}
