import type {
    ContentModelBlockGroup,
    ContentModelBlockWithCache,
    ContentModelDocument,
    IterateSelectionsCallback,
    IterateSelectionsOption,
    ReadonlyContentModelBlockGroup,
    ReadonlyContentModelSegment,
    ReadonlyIterateSelectionsCallback,
    ReadonlyTableSelectionContext,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * This is a temporary type to pass the information of whether element cache should be persisted when possible
 */
export interface ContentModelDocumentWithPersistedCache extends ContentModelDocument {
    /**
     * When set to
     */
    persistCache?: boolean;
}

/**
 * Iterate all selected elements in a given model
 * @param group The given Content Model to iterate selection from
 * @param callback The callback function to access the selected element
 * @param option Option to determine how to iterate
 */
export function iterateSelections(
    group: ContentModelBlockGroup,
    callback: IterateSelectionsCallback,
    option?: IterateSelectionsOption
): void;

/**
 * Iterate all selected elements in a given model (Readonly)
 * @param group The given Content Model to iterate selection from
 * @param callback The callback function to access the selected element
 * @param option Option to determine how to iterate
 */
export function iterateSelections(
    group: ReadonlyContentModelBlockGroup,
    callback: ReadonlyIterateSelectionsCallback,
    option?: IterateSelectionsOption
): void;

export function iterateSelections(
    group: ReadonlyContentModelBlockGroup,
    callback: ReadonlyIterateSelectionsCallback | IterateSelectionsCallback,
    option?: IterateSelectionsOption
): void {
    const persistCache =
        group.blockGroupType == 'Document'
            ? (group as ContentModelDocumentWithPersistedCache).persistCache
            : false;
    const internalCallback: ReadonlyIterateSelectionsCallback = persistCache
        ? (callback as ReadonlyIterateSelectionsCallback)
        : (path, tableContext, block, segments) => {
              if (!!(block as ContentModelBlockWithCache)?.cachedElement) {
                  delete (block as ContentModelBlockWithCache).cachedElement;
              }

              return (callback as ReadonlyIterateSelectionsCallback)(
                  path,
                  tableContext,
                  block,
                  segments
              );
          };

    internalIterateSelections([group], internalCallback, option);
}

function internalIterateSelections(
    path: ReadonlyContentModelBlockGroup[],
    callback: ReadonlyIterateSelectionsCallback,
    option?: IterateSelectionsOption,
    table?: ReadonlyTableSelectionContext,
    treatAllAsSelect?: boolean
): boolean {
    const parent = path[0];
    const includeListFormatHolder = option?.includeListFormatHolder || 'allSegments';
    const contentUnderSelectedTableCell = option?.contentUnderSelectedTableCell || 'include';
    const contentUnderSelectedGeneralElement =
        option?.contentUnderSelectedGeneralElement || 'contentOnly';

    let hasSelectedSegment = false;
    let hasUnselectedSegment = false;

    for (let i = 0; i < parent.blocks.length; i++) {
        const block = parent.blocks[i];

        switch (block.blockType) {
            case 'BlockGroup':
                const newPath = [block, ...path];

                if (block.blockGroupType == 'General') {
                    const isSelected = treatAllAsSelect || block.isSelected;
                    const handleGeneralContent =
                        !isSelected ||
                        contentUnderSelectedGeneralElement == 'both' ||
                        contentUnderSelectedGeneralElement == 'contentOnly';
                    const handleGeneralElement =
                        isSelected &&
                        (contentUnderSelectedGeneralElement == 'both' ||
                            contentUnderSelectedGeneralElement == 'generalElementOnly' ||
                            block.blocks.length == 0);

                    if (
                        (handleGeneralContent &&
                            internalIterateSelections(
                                newPath,
                                callback,
                                option,
                                table,
                                isSelected
                            )) ||
                        (handleGeneralElement && callback(path, table, block))
                    ) {
                        return true;
                    }
                } else if (
                    internalIterateSelections(newPath, callback, option, table, treatAllAsSelect)
                ) {
                    return true;
                }
                break;

            case 'Table':
                const rows = block.rows;
                const isWholeTableSelected = rows.every(row =>
                    row.cells.every(cell => cell.isSelected)
                );

                if (contentUnderSelectedTableCell != 'include' && isWholeTableSelected) {
                    if (callback(path, table, block)) {
                        return true;
                    }
                } else {
                    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                        const row = rows[rowIndex];

                        for (let colIndex = 0; colIndex < row.cells.length; colIndex++) {
                            const cell = row.cells[colIndex];
                            if (!cell) {
                                continue;
                            }

                            const newTable: ReadonlyTableSelectionContext = {
                                table: block,
                                rowIndex,
                                colIndex,
                                isWholeTableSelected,
                            };

                            if (cell.isSelected && callback(path, newTable)) {
                                return true;
                            }

                            if (
                                !cell.isSelected ||
                                contentUnderSelectedTableCell != 'ignoreForTableOrCell'
                            ) {
                                const newPath = [cell, ...path];
                                const isSelected = treatAllAsSelect || cell.isSelected;

                                if (
                                    internalIterateSelections(
                                        newPath,
                                        callback,
                                        option,
                                        newTable,
                                        isSelected
                                    )
                                ) {
                                    return true;
                                }
                            }
                        }
                    }
                }

                break;

            case 'Paragraph':
                const segments: ReadonlyContentModelSegment[] = [];

                for (let i = 0; i < block.segments.length; i++) {
                    const segment = block.segments[i];
                    const isSelected = treatAllAsSelect || segment.isSelected;

                    if (segment.segmentType == 'General') {
                        const handleGeneralContent =
                            !isSelected ||
                            contentUnderSelectedGeneralElement == 'both' ||
                            contentUnderSelectedGeneralElement == 'contentOnly';
                        const handleGeneralElement =
                            isSelected &&
                            (contentUnderSelectedGeneralElement == 'both' ||
                                contentUnderSelectedGeneralElement == 'generalElementOnly' ||
                                segment.blocks.length == 0);

                        if (
                            handleGeneralContent &&
                            internalIterateSelections(
                                [segment, ...path],
                                callback,
                                option,
                                table,
                                isSelected
                            )
                        ) {
                            return true;
                        }

                        if (handleGeneralElement) {
                            segments.push(segment);
                        }
                    } else if (isSelected) {
                        segments.push(segment);
                    }

                    if (isSelected) {
                        hasSelectedSegment = true;
                    } else {
                        hasUnselectedSegment = true;
                    }
                }

                if (segments.length > 0 && callback(path, table, block, segments)) {
                    return true;
                }
                break;

            case 'Divider':
            case 'Entity':
                if ((treatAllAsSelect || block.isSelected) && callback(path, table, block)) {
                    return true;
                }

                break;
        }
    }

    if (
        includeListFormatHolder != 'never' &&
        parent.blockGroupType == 'ListItem' &&
        hasSelectedSegment &&
        (!hasUnselectedSegment || includeListFormatHolder == 'anySegment') &&
        // When whole list item is selected, also add its format holder as selected segment
        callback(path, table, undefined /*block*/, [parent.formatHolder])
    ) {
        return true;
    }

    return false;
}
