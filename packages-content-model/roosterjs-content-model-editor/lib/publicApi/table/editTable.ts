import hasSelectionInBlock from '../selection/hasSelectionInBlock';
import { alignTable } from '../../modelApi/table/alignTable';
import { alignTableCell } from '../../modelApi/table/alignTableCell';
import { applyTableFormat } from '../../modelApi/table/applyTableFormat';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { normalizeTable } from '../../modelApi/table/normalizeTable';
import { setSelection } from 'roosterjs-content-model-editor/lib/modelApi/selection/setSelection';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';
import { TableOperation } from 'roosterjs-editor-types';
import {
    ContentModelBlockGroup,
    ContentModelDocument,
    ContentModelParagraph,
    ContentModelTable,
} from 'roosterjs-content-model-types';
import {
    createBr,
    createParagraph,
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
    formatWithContentModel(editor, 'editTable', model => {
        const [tableModel, parent] = getFirstSelectedTable(model);

        if (tableModel) {
            switch (operation) {
                case TableOperation.AlignCellLeft:
                case TableOperation.AlignCellCenter:
                case TableOperation.AlignCellRight:
                    alignTableCell(tableModel, operation);
                    break;
                case TableOperation.AlignCellTop:
                case TableOperation.AlignCellMiddle:
                case TableOperation.AlignCellBottom:
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

            ensureTableSelection(model, parent, tableModel);

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

function ensureTableSelection(
    model: ContentModelDocument,
    parent: ContentModelBlockGroup | undefined,
    table: ContentModelTable
) {
    if (!hasSelectionInBlock(table)) {
        let paragraph: ContentModelParagraph | undefined;
        const firstCell = table.rows.filter(row => row.cells.length > 0)[0]?.cells[0];

        if (firstCell) {
            paragraph = firstCell.blocks.filter(
                (block): block is ContentModelParagraph => block.blockType == 'Paragraph'
            )[0];

            if (!paragraph) {
                paragraph = createEmptyParagraph(model);
                firstCell.blocks.push(paragraph);
            }
        } else if (parent) {
            const index = parent.blocks.indexOf(table);

            if (index >= 0) {
                paragraph = createEmptyParagraph(model);
                parent.blocks.splice(index, 1, paragraph);
            }
        }

        if (paragraph) {
            const marker = createSelectionMarker(model.format);

            paragraph.segments.unshift(marker);
            setParagraphNotImplicit(paragraph);
            setSelection(model, marker);
        }
    }
}

function createEmptyParagraph(model: ContentModelDocument) {
    const newPara = createParagraph(false /*isImplicit*/, undefined /*blockFormat*/, model.format);
    const br = createBr(model.format);

    newPara.segments.push(br);

    return newPara;
}
