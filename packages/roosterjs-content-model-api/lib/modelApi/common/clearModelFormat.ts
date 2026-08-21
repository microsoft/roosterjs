import { adjustWordSelection } from '../selection/adjustWordSelection';
import {
    applyTableFormat,
    copyFormat,
    createFormatContainer,
    getClosestAncestorBlockGroupIndex,
    iterateSelections,
    mutateBlock,
    mutateSegments,
} from 'roosterjs-content-model-dom';
import type {
    ContentModelSegmentFormat,
    ContentModelTable,
    ContentModelTableCellFormat,
    ReadonlyContentModelBlock,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelDocument,
    ReadonlyContentModelFormatContainer,
    ReadonlyContentModelListItem,
    ReadonlySelectable,
    ReadonlyTableSelectionContext,
    ShallowMutableContentModelBlock,
    ShallowMutableContentModelFormatContainer,
    ShallowMutableContentModelSegment,
    ShallowMutableContentModelTable,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function clearModelFormat(
    model: ReadonlyContentModelDocument,
    blocksToClear: [ReadonlyContentModelBlockGroup[], ShallowMutableContentModelBlock][],
    segmentsToClear: ShallowMutableContentModelSegment[],
    tablesToClear: [ContentModelTable, boolean][]
): boolean {
    let pendingStructureChange = false;

    iterateSelections(
        model,
        (path, tableContext, block, segments) => {
            if (segments) {
                if (block?.blockType == 'Paragraph') {
                    const [, mutableSegments] = mutateSegments(block, segments);

                    segmentsToClear.push(...mutableSegments);
                } else if (
                    path[0].blockGroupType == 'ListItem' &&
                    segments.length == 1 &&
                    path[0].formatHolder == segments[0]
                ) {
                    segmentsToClear.push(mutateBlock(path[0]).formatHolder);
                }
            }

            if (block) {
                blocksToClear.push([path, mutateBlock(block)]);
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
        pendingStructureChange = clearListFormat(blocksToClear[0][0]) || pendingStructureChange;
    } else if (blocksToClear.length > 1 || blocksToClear.some(x => isWholeBlockSelected(x[1]))) {
        // 2. If a full block or multiple blocks are selected, clear block format
        for (let i = blocksToClear.length - 1; i >= 0; i--) {
            const [path, block] = blocksToClear[i];

            clearBlockFormat(path, block);
            pendingStructureChange = clearListFormat(path) || pendingStructureChange;
            clearContainerFormat(path, block);
        }
    }

    // 3. Finally clear format for segments
    clearSegmentsFormat(segmentsToClear, model.format);

    // 4. Clear format for table if any
    createTablesFormat(tablesToClear);

    return pendingStructureChange;
}

function createTablesFormat(tablesToClear: [ContentModelTable, boolean][]) {
    tablesToClear.forEach(x => {
        const [table, isWholeTableSelected] = x;
        if (isWholeTableSelected) {
            table.format = {
                useBorderBox: table.format.useBorderBox,
                borderCollapse: table.format.borderCollapse,
            };
        }

        applyTableFormat(table, undefined /*newFormat*/, true);
    });
}

function clearSegmentsFormat(
    segmentsToClear: ShallowMutableContentModelSegment[],
    defaultSegmentFormat: Readonly<ContentModelSegmentFormat> | undefined
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
    tableContext: ReadonlyTableSelectionContext | undefined,
    tablesToClear: [ShallowMutableContentModelTable, boolean][]
) {
    if (tableContext) {
        const { table, colIndex, rowIndex, isWholeTableSelected } = tableContext;
        const cell = table.rows[rowIndex].cells[colIndex];

        if (cell.isSelected) {
            const mutableCell = mutateBlock(cell);

            mutableCell.isHeader = false;
            const newFormat: ContentModelTableCellFormat = {};
            copyFormat(newFormat, cell.format, [
                'useBorderBox',
                'verticalAlign',
                'height',
                'width',
                'borderTop',
                'borderBottom',
                'borderLeft',
                'borderRight',
            ]);
            mutableCell.format = newFormat;
        }

        if (!tablesToClear.find(x => x[0] == table)) {
            tablesToClear.push([mutateBlock(table), isWholeTableSelected]);
        }
    }
}

function clearContainerFormat(
    path: ReadonlyContentModelBlockGroup[],
    block: ShallowMutableContentModelBlock
) {
    const containerPathIndex = getClosestAncestorBlockGroupIndex(
        path,
        ['FormatContainer'],
        ['TableCell']
    );

    if (containerPathIndex >= 0 && containerPathIndex < path.length - 1) {
        const container = mutateBlock(
            path[containerPathIndex] as ReadonlyContentModelFormatContainer
        );
        const containerIndex = path[containerPathIndex + 1].blocks.indexOf(container);
        const blockIndex = container.blocks.indexOf(block);

        if (blockIndex >= 0 && containerIndex >= 0) {
            const newContainer: ShallowMutableContentModelFormatContainer = createFormatContainer(
                container.tagName,
                container.format
            );

            container.blocks.splice(blockIndex, 1);
            newContainer.blocks = container.blocks.splice(blockIndex);

            mutateBlock(path[containerPathIndex + 1]).blocks.splice(
                containerIndex + 1,
                0,
                block,
                newContainer
            );
        }
    }
}

function clearListFormat(path: ReadonlyContentModelBlockGroup[]) {
    const listItem = path[getClosestAncestorBlockGroupIndex(path, ['ListItem'], ['TableCell'])] as
        | ReadonlyContentModelListItem
        | undefined;

    if (listItem) {
        mutateBlock(listItem).levels = [];

        return true;
    } else {
        return false;
    }
}

function clearBlockFormat(
    path: ReadonlyContentModelBlockGroup[],
    block: ShallowMutableContentModelBlock
) {
    if (block.blockType == 'Divider') {
        const index = path[0].blocks.indexOf(block);

        if (index >= 0) {
            mutateBlock(path[0]).blocks.splice(index, 1);
        }
    } else if (block.blockType == 'Paragraph') {
        block.format = {};
        delete block.decorator;
    }
}

function isOnlySelectionMarkerSelected(block: ReadonlyContentModelBlock) {
    const segments = block.blockType == 'Paragraph' ? block.segments.filter(x => x.isSelected) : [];

    return segments.length == 1 && segments[0].segmentType == 'SelectionMarker';
}

function isWholeBlockSelected(block: ReadonlyContentModelBlock) {
    return (
        (block as ReadonlySelectable).isSelected ||
        (block.blockType == 'Paragraph' && block.segments.every(x => x.isSelected))
    );
}
