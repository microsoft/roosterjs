import { adjustWordSelection } from '../selection/adjustWordSelection';
import { applyTableFormat } from '../table/applyTableFormat';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelBlock } from '../../publicTypes/block/ContentModelBlock';
import { ContentModelBlockGroup } from '../../publicTypes/group/ContentModelBlockGroup';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelFormatContainer } from '../../publicTypes/group/ContentModelFormatContainer';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelSegment } from '../../publicTypes/segment/ContentModelSegment';
import { ContentModelSegmentFormat } from '../../publicTypes/format/ContentModelSegmentFormat';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { createFormatContainer } from '../creators/createFormatContainer';
import { getClosestAncestorBlockGroupIndex } from './getClosestAncestorBlockGroupIndex';
import { iterateSelections } from '../selection/iterateSelections';
import { Selectable } from '../../publicTypes/selection/Selectable';
import { TableSelectionContext } from '../../publicTypes/selection/TableSelectionContext';
import { updateTableCellMetadata } from '../../domUtils/metadata/updateTableCellMetadata';
import { updateTableMetadata } from '../../domUtils/metadata/updateTableMetadata';

/**
 * @internal
 */
export function clearModelFormat(
    model: ContentModelDocument,
    blocksToClear: [ContentModelBlockGroup[], ContentModelBlock][],
    segmentsToClear: ContentModelSegment[],
    tablesToClear: [ContentModelTable, boolean][]
) {
    iterateSelections(
        [model],
        (path, tableContext, block, segments) => {
            if (segments) {
                arrayPush(segmentsToClear, segments);
            }

            if (block) {
                blocksToClear.push([path, block]);
            } else if (tableContext) {
                clearTableCellFormat(tableContext, tablesToClear);
            }
        },
        {
            // When there is a default format to apply, we know how to handle segment format under list.
            // So no need to clear format of list number.
            // Otherwise, we will clear all format of selected text. And since they are under LI tag, we
            // also need to clear the format of LI (format holder) so that the format is really cleared
            includeListFormatHolder: model.format ? 'never' : 'anySegment',
        }
    );

    const marker = segmentsToClear[0];

    // 2. If selection is collapsed, add selection to whole word to clear if any
    if (
        blocksToClear.length == 1 &&
        isOnlySelectionMarkerSelected(blocksToClear[0][1]) &&
        blocksToClear.length == 1
    ) {
        segmentsToClear.splice(0, segmentsToClear.length, ...adjustWordSelection(model, marker));
        clearListFormat(blocksToClear[0][0]);
    } else if (blocksToClear.length > 1 || blocksToClear.some(x => isWholeBlockSelected(x[1]))) {
        // 2. If a full block or multiple blocks are selected, clear block format
        for (let i = blocksToClear.length - 1; i >= 0; i--) {
            const [path, block] = blocksToClear[i];

            clearBlockFormat(path, block);
            clearListFormat(path);
            clearContainerFormat(path, block);
        }
    }

    // 3. Finally clear format for segments
    clearSegmentsFormat(segmentsToClear, model.format);

    // 4. Clear format for table if any
    createTablesFormat(tablesToClear);
}

function createTablesFormat(tablesToClear: [ContentModelTable, boolean][]) {
    tablesToClear.forEach(x => {
        const [table, isWholeTableSelected] = x;
        if (isWholeTableSelected) {
            table.format = {
                useBorderBox: table.format.useBorderBox,
                borderCollapse: table.format.borderCollapse,
            };
            updateTableMetadata(table, () => null);
        }

        applyTableFormat(table, undefined /*newFormat*/, true);
    });
}

function clearSegmentsFormat(
    segmentsToClear: ContentModelSegment[],
    defaultSegmentFormat: ContentModelSegmentFormat | undefined
) {
    segmentsToClear.forEach(x => {
        x.format = { ...(defaultSegmentFormat || {}) };

        if (x.link) {
            delete x.link.format.textColor;
        }

        delete x.code;
    });
}

function clearTableCellFormat(
    tableContext: TableSelectionContext | undefined,
    tablesToClear: [ContentModelTable, boolean][]
) {
    if (tableContext) {
        const { table, colIndex, rowIndex, isWholeTableSelected } = tableContext;
        const cell = table.rows[rowIndex].cells[colIndex];

        if (cell.isSelected) {
            updateTableCellMetadata(cell, () => null);
            cell.isHeader = false;
            cell.format = {
                useBorderBox: cell.format.useBorderBox,
            };
        }

        if (!tablesToClear.find(x => x[0] == table)) {
            tablesToClear.push([table, isWholeTableSelected]);
        }
    }
}

function clearContainerFormat(path: ContentModelBlockGroup[], block: ContentModelBlock) {
    const containerPathIndex = getClosestAncestorBlockGroupIndex(
        path,
        ['FormatContainer'],
        ['TableCell']
    );

    if (containerPathIndex >= 0 && containerPathIndex < path.length - 1) {
        const container = path[containerPathIndex] as ContentModelFormatContainer;
        const containerIndex = path[containerPathIndex + 1].blocks.indexOf(container);
        const blockIndex = container.blocks.indexOf(block);

        if (blockIndex >= 0 && containerIndex >= 0) {
            const newContainer = createFormatContainer(container.tagName, container.format);

            container.blocks.splice(blockIndex, 1);
            newContainer.blocks = container.blocks.splice(blockIndex);

            path[containerPathIndex + 1].blocks.splice(containerIndex + 1, 0, block, newContainer);
        }
    }
}

function clearListFormat(path: ContentModelBlockGroup[]) {
    const listItem = path[getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell'])] as
        | ContentModelListItem
        | undefined;

    if (listItem) {
        listItem.levels = [];
    }
}

function clearBlockFormat(path: ContentModelBlockGroup[], block: ContentModelBlock) {
    if (block.blockType == 'Divider') {
        const index = path[0].blocks.indexOf(block);

        if (index >= 0) {
            path[0].blocks.splice(index, 1);
        }
    } else if (block.blockType == 'Paragraph') {
        block.format = {};
        delete block.decorator;
    }
}

function isOnlySelectionMarkerSelected(block: ContentModelBlock) {
    const segments = block.blockType == 'Paragraph' ? block.segments.filter(x => x.isSelected) : [];

    return segments.length == 1 && segments[0].segmentType == 'SelectionMarker';
}

function isWholeBlockSelected(block: ContentModelBlock) {
    return (
        (block as Selectable).isSelected ||
        (block.blockType == 'Paragraph' && block.segments.every(x => x.isSelected))
    );
}
