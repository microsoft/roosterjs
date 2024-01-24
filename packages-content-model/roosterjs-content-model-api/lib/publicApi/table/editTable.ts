import { alignTable } from '../../modelApi/table/alignTable';
import { deleteTable } from '../../modelApi/table/deleteTable';
import { deleteTableColumn } from '../../modelApi/table/deleteTableColumn';
import { deleteTableRow } from '../../modelApi/table/deleteTableRow';
import { ensureFocusableParagraphForTable } from '../../modelApi/table/ensureFocusableParagraphForTable';
import { insertTableColumn } from '../../modelApi/table/insertTableColumn';
import { insertTableRow } from '../../modelApi/table/insertTableRow';
import { mergeTableCells } from '../../modelApi/table/mergeTableCells';
import { mergeTableColumn } from '../../modelApi/table/mergeTableColumn';
import { mergeTableRow } from '../../modelApi/table/mergeTableRow';
import { splitTableCellHorizontally } from '../../modelApi/table/splitTableCellHorizontally';
import { splitTableCellVertically } from '../../modelApi/table/splitTableCellVertically';

import {
    hasSelectionInBlock,
    applyTableFormat,
    getFirstSelectedTable,
    normalizeTable,
    setSelection,
} from 'roosterjs-content-model-core';
import type { TableOperation, IStandaloneEditor } from 'roosterjs-content-model-types';
import {
    alignTableCellHorizontally,
    alignTableCellVertically,
} from '../../modelApi/table/alignTableCell';
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
export default function editTable(
    editor: IStandaloneEditor,
    operation: TableOperation,
    skipSnapshot?: boolean
) {
    editor.focus();

    editor.formatContentModel(
        (model, context) => {
            const [tableModel, path] = getFirstSelectedTable(model);

            if (tableModel) {
                context.skipUndoSnapshot = skipSnapshot;

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

                normalizeTable(tableModel, model.format);

                if (hasMetadata(tableModel)) {
                    applyTableFormat(tableModel, undefined /*newFormat*/, true /*keepCellShade*/);
                }

                return true;
            } else {
                return false;
            }
        },
        {
            apiName: 'editTable',
        }
    );
}
