import { alignTable } from '../../modelApi/table/alignTable';
import { alignTableCell } from '../../modelApi/table/alignTableCell';
import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { ChangeSource, TableOperation } from 'roosterjs-editor-types';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';

/**
 * Format current focused table with the given format
 * @param editor The editor instance
 * @param format The table format to apply
 */
export default function editTable(
    editor: IExperimentalContentModelEditor,
    operation: TableOperation
) {
    const table = editor.getElementAtCursor('TABLE');
    const model = editor.createContentModel(table);
    const tableModel = model.blocks[0];

    if (tableModel?.blockType == ContentModelBlockType.Table) {
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
        applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);

        editor.addUndoSnapshot(
            () => {
                editor.focus();
                editor.setContentModel(model, fragment => editor.replaceNode(table, fragment));
            },
            ChangeSource.Format,
            false /*canUndoByBackspace*/,
            { formatApiName: 'editTable' }
        );
    }
}
