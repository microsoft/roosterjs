import { createRange, getSelectionPath, queryElements } from 'roosterjs-editor-dom';
import { createTableRanges } from 'roosterjs-content-model-core';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import type { DOMSelection } from 'roosterjs-content-model-types';
import type { ContentMetadata, SelectionRangeEx } from 'roosterjs-editor-types';

// In theory, all functions below are not necessary. We keep these functions here only for compatibility with old IEditor interface

/**
 * @internal
 */
export function convertRangeExToDomSelection(
    rangeEx: SelectionRangeEx | null
): DOMSelection | null {
    switch (rangeEx?.type) {
        case SelectionRangeTypes.ImageSelection:
            return {
                type: 'image',
                image: rangeEx.image,
            };

        case SelectionRangeTypes.Normal:
            return rangeEx.ranges.length > 0
                ? {
                      type: 'range',
                      range: rangeEx.ranges[0],
                  }
                : null;

        case SelectionRangeTypes.TableSelection:
            return rangeEx.coordinates
                ? {
                      type: 'table',
                      table: rangeEx.table,
                      firstColumn: rangeEx.coordinates.firstCell.x,
                      firstRow: rangeEx.coordinates.firstCell.y,
                      lastColumn: rangeEx.coordinates.lastCell.x,
                      lastRow: rangeEx.coordinates.lastCell.y,
                  }
                : null;

        default:
            return null;
    }
}

/**
 * @internal
 */
export function convertDomSelectionToRangeEx(selection: DOMSelection | null): SelectionRangeEx {
    switch (selection?.type) {
        case 'image':
            return {
                type: SelectionRangeTypes.ImageSelection,
                image: selection.image,
                areAllCollapsed: false,
                ranges: [createRange(selection.image)],
            };

        case 'range':
            return {
                type: SelectionRangeTypes.Normal,
                ranges: [selection.range],
                areAllCollapsed: selection.range.collapsed,
            };

        case 'table':
            return {
                type: SelectionRangeTypes.TableSelection,
                ranges: createTableRanges(selection),
                areAllCollapsed: false,
                table: selection.table,
                coordinates: {
                    firstCell: { x: selection.firstColumn, y: selection.firstRow },
                    lastCell: { x: selection.lastColumn, y: selection.lastRow },
                },
            };

        default:
            return {
                type: SelectionRangeTypes.Normal,
                ranges: [],
                areAllCollapsed: true,
            };
    }
}

/**
 * @internal
 */
export function convertMetadataToDOMSelection(
    contentDiv: HTMLElement,
    metadata: ContentMetadata | undefined
): DOMSelection | null {
    switch (metadata?.type) {
        case SelectionRangeTypes.Normal:
            return {
                type: 'range',
                range: createRange(contentDiv, metadata.start, metadata.end),
            };
        case SelectionRangeTypes.TableSelection:
            const table = queryElements(contentDiv, '#' + metadata.tableId)[0] as HTMLTableElement;

            return table
                ? {
                      type: 'table',
                      table: table,
                      firstColumn: metadata.firstCell.x,
                      firstRow: metadata.firstCell.y,
                      lastColumn: metadata.lastCell.x,
                      lastRow: metadata.lastCell.y,
                  }
                : null;
        case SelectionRangeTypes.ImageSelection:
            const image = queryElements(contentDiv, '#' + metadata.imageId)[0] as HTMLImageElement;

            return image
                ? {
                      type: 'image',
                      image: image,
                  }
                : null;

        default:
            return null;
    }
}
