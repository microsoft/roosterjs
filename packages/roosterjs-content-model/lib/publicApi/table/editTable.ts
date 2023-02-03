import { alignTable } from '../../modelApi/table/alignTable';
import { alignTableCell } from '../../modelApi/table/alignTableCell';
import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { hasMetadata } from '../../domUtils/metadata/updateMetadata';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';
import { TableOperation } from 'roosterjs-editor-types';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param operation The table operation to apply
 */
export default function editTable(editor: IContentModelEditor, operation: TableOperation) {
    formatWithContentModel(editor, 'editTable', model => {
        const tableModel = getFirstSelectedTable(model);

        if (tableModel) {
            switch (operation) {
                case TableOperation.AlignCellBottom:
                case TableOperation.AlignCellCenter:
                case TableOperation.AlignCellLeft:
                case TableOperation.AlignCellMiddle:
                case TableOperation.AlignCellRight:
                case TableOperation.AlignCellTop:
                    alignTableCell(tableModel, operation);
                    break;

                case TableOperation.AlignCenter:
                case TableOperation.AlignLeft:
                case TableOperation.AlignRight:
                    alignTable(tableModel, operation);
                    break;

                case TableOperation.DeleteColumn:
                    deleteTableColumn(tableModel);
                    break;

                case TableOperation.DeleteRow:
                    deleteTableRow(tableModel);
                    break;

                case TableOperation.DeleteTable:
                    deleteTable(tableModel);
                    break;

                case TableOperation.InsertAbove:
                case TableOperation.InsertBelow:
                    insertTableRow(tableModel, operation);
                    break;

                case TableOperation.InsertLeft:
                case TableOperation.InsertRight:
                    insertTableColumn(tableModel, operation);
                    break;

                case TableOperation.MergeAbove:
                case TableOperation.MergeBelow:
                    mergeTableRow(tableModel, operation);
                    break;

                case TableOperation.MergeCells:
                    mergeTableCells(tableModel);
                    break;

                case TableOperation.MergeLeft:
                case TableOperation.MergeRight:
                    mergeTableColumn(tableModel, operation);
                    break;

                case TableOperation.SplitHorizontally:
                    splitTableCellHorizontally(tableModel);
                    break;

                case TableOperation.SplitVertically:
                    splitTableCellVertically(tableModel);
                    break;
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
