import hasSelectionInBlock from '../selection/hasSelectionInBlock';
import { alignTable } from '../../modelApi/table/alignTable';
import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { ensureFocusableParagraphForTable } from '../../modelApi/table/ensureFocusableParagraphForTable';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setSelection } from '../../modelApi/selection/setSelection';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';
import type { TableOperation } from '../../publicTypes/parameter/TableOperation';
import {
    alignTableCellHorizontally,
    alignTableCellVertically,
} from '../../modelApi/table/alignTableCell';
import type { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import {
    createSelectionMarker,
    hasMetadata,
    setParagraphNotImplicit,
} from 'roosterjs-content-model-dom';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param operation The table operation to apply
 */
export default function editTable(editor: IContentModelEditor, operation: TableOperation) {
    editor.focus();

    formatWithContentModel(editor, 'editTable', model => {
        const [tableModel, path] = getFirstSelectedTable(model);

        if (tableModel) {
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
            }

            if (!hasSelectionInBlock(tableModel)) {
                const paragraph = ensureFocusableParagraphForTable(model, path, tableModel);

                if (paragraph) {
                    const marker = createSelectionMarker(model.format);

                    paragraph.segments.unshift(marker);
                    setParagraphNotImplicit(paragraph);
                    setSelection(model, marker);
                }
            }

            normalizeTable(tableModel);

            if (hasMetadata(tableModel)) {
                applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);
            }

            return true;
        } else {
            return false;
        }
    });
}
