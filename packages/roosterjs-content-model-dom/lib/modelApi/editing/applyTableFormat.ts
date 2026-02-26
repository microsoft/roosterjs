import { BorderKeys } from '../../formatHandlers/utils/borderKeys';
import { combineBorderValue, extractBorderValues } from '../../domUtils/style/borderValues';
import { mutateBlock, mutateSegment } from '../common/mutate';
import { setTableCellBackgroundColor } from './setTableCellBackgroundColor';
import { TableBorderFormat } from '../../constants/TableBorderFormat';
import { updateTableCellMetadata } from '../metadata/updateTableCellMetadata';
import { updateTableMetadata } from '../metadata/updateTableMetadata';
import type {
    BorderFormat,
    ReadonlyContentModelTable,
    ShallowMutableContentModelTableRow,
    TableMetadataFormat,
} from 'roosterjs-content-model-types';

const DEFAULT_FORMAT: TableMetadataFormat = {
    topBorderColor: '#ABABAB',
    bottomBorderColor: '#ABABAB',
    verticalBorderColor: '#ABABAB',
    hasHeaderRow: false,
    hasFirstColumn: false,
    hasBandedRows: false,
    hasBandedColumns: false,
    bgColorEven: null,
    bgColorOdd: '#ABABAB20',
    headerRowColor: '#ABABAB',
    tableBorderFormat: TableBorderFormat.Default,
    verticalAlign: null,
};

type MetaOverrides = {
    bgColorOverrides: boolean[][];
    vAlignOverrides: boolean[][];
    borderOverrides: boolean[][];
};

/**
 * Apply table format from table metadata and the passed in new format
 * @param table The table to apply format to
 * @param newFormat @optional New format to apply. When passed, this value will be merged into existing metadata format and default format
 * @param keepCellShade @optional When pass true, table cells with customized shade color will not be overwritten. @default false
 */
export function applyTableFormat(
    table: ReadonlyContentModelTable,
    newFormat?: TableMetadataFormat,
    keepCellShade?: boolean
) {
    const mutableTable = mutateBlock(table);
    const { rows } = mutableTable;

    updateTableMetadata(mutableTable, format => {
        const effectiveMetadata: TableMetadataFormat = {
            ...DEFAULT_FORMAT,
            ...format,
            ...newFormat,
        };

        const metaOverrides: MetaOverrides = updateOverrides(rows, !keepCellShade);

        formatCells(rows, effectiveMetadata, metaOverrides);
        setFirstColumnFormatBorders(rows, effectiveMetadata);
        setHeaderRowFormat(rows, effectiveMetadata, metaOverrides);

        return effectiveMetadata;
    });
}

function updateOverrides(
    rows: ShallowMutableContentModelTableRow[],
    removeCellShade: boolean
): MetaOverrides {
    const overrides: MetaOverrides = {
        bgColorOverrides: [],
        vAlignOverrides: [],
        borderOverrides: [],
    };

    rows.forEach(row => {
        const bgColorOverrides: boolean[] = [];
        const vAlignOverrides: boolean[] = [];
        const borderOverrides: boolean[] = [];

        overrides.bgColorOverrides.push(bgColorOverrides);
        overrides.vAlignOverrides.push(vAlignOverrides);
        overrides.borderOverrides.push(borderOverrides);

        row.cells.forEach(cell => {
            updateTableCellMetadata(mutateBlock(cell), metadata => {
                if (metadata && removeCellShade) {
                    bgColorOverrides.push(false);
                    delete metadata.bgColorOverride;
                } else {
                    bgColorOverrides.push(!!metadata?.bgColorOverride);
                }
                vAlignOverrides.push(!!metadata?.vAlignOverride);
                borderOverrides.push(!!metadata?.borderOverride);

                return metadata;
            });
        });
    });

    return overrides;
}

type ShouldUseTransparentBorder = (indexProp: {
    firstRow: boolean;
    lastRow: boolean;
    firstColumn: boolean;
    lastColumn: boolean;
}) => [boolean, boolean, boolean, boolean];

const BorderFormatters: Record<number, ShouldUseTransparentBorder | undefined> = {
    [TableBorderFormat.Default]: _ => [false, false, false, false],
    [TableBorderFormat.ListWithSideBorders]: ({ lastColumn, firstColumn }) => [
        false,
        !lastColumn,
        false,
        !firstColumn,
    ],
    [TableBorderFormat.FirstColumnHeaderExternal]: ({
        firstColumn,
        firstRow,
        lastColumn,
        lastRow,
    }) => [
        !firstRow,
        (!lastColumn && !firstColumn) || (firstColumn && firstRow),
        !lastRow && !firstRow,
        !firstColumn,
    ],
    [TableBorderFormat.NoHeaderBorders]: ({ firstRow, firstColumn, lastColumn }) => [
        firstRow,
        firstRow || lastColumn,
        false,
        firstRow || firstColumn,
    ],
    [TableBorderFormat.NoSideBorders]: ({ firstColumn, lastColumn }) => [
        false,
        lastColumn,
        false,
        firstColumn,
    ],
    [TableBorderFormat.EspecialType1]: ({ firstRow, firstColumn }) => [
        firstColumn && !firstRow,
        firstRow,
        firstColumn && !firstRow,
        firstRow && !firstColumn,
    ],
    [TableBorderFormat.EspecialType2]: ({ firstRow, firstColumn }) => [
        !firstRow,
        firstRow || !firstColumn,
        !firstRow,
        !firstColumn,
    ],
    [TableBorderFormat.EspecialType3]: ({ firstColumn, firstRow }) => [
        true,
        firstRow || !firstColumn,
        !firstRow,
        true,
    ],
    [TableBorderFormat.Clear]: () => [true, true, true, true],
};

/*
 * Apply vertical align, borders, and background color to all cells in the table
 */
function formatCells(
    rows: ShallowMutableContentModelTableRow[],
    format: TableMetadataFormat,
    metaOverrides: MetaOverrides
) {
    const {
        hasBandedRows,
        hasBandedColumns,
        bgColorOdd,
        bgColorEven,
        hasFirstColumn,
        hasHeaderRow,
    } = format;

    rows.forEach((row, rowIndex) => {
        row.cells.forEach((readonlyCell, colIndex) => {
            const cell = mutateBlock(readonlyCell);

            // Format Borders
            if (
                !metaOverrides.borderOverrides[rowIndex][colIndex] &&
                typeof format.tableBorderFormat == 'number'
            ) {
                const transparentBorderMatrix = BorderFormatters[format.tableBorderFormat]?.({
                    firstRow: rowIndex === 0,
                    lastRow: rowIndex === rows.length - 1,
                    firstColumn: colIndex === 0,
                    lastColumn: colIndex === row.cells.length - 1,
                });

                const formatColor = [
                    format.topBorderColor,
                    format.verticalBorderColor,
                    format.bottomBorderColor,
                    format.verticalBorderColor,
                ];

                transparentBorderMatrix?.forEach((alwaysUseTransparent, i) => {
                    const borderColor = (!alwaysUseTransparent && formatColor[i]) || '';

                    cell.format[BorderKeys[i]] = combineBorderValue({
                        style: getBorderStyleFromColor(borderColor),
                        width: '1px',
                        color: borderColor,
                    });
                });
            }

            // Format Background Color
            if (!metaOverrides.bgColorOverrides[rowIndex][colIndex]) {
                const bandedColumnMod = hasFirstColumn ? 0 : 1;
                const bandedRowMod = hasHeaderRow ? 0 : 1;
                const color =
                    hasBandedRows || hasBandedColumns
                        ? (hasBandedColumns && colIndex % 2 != bandedColumnMod) ||
                          (hasBandedRows && rowIndex % 2 != bandedRowMod)
                            ? bgColorOdd
                            : bgColorEven
                        : bgColorEven; /* bgColorEven is the default color */

                setTableCellBackgroundColor(
                    cell,
                    color,
                    false /*isColorOverride*/,
                    true /*applyToSegments*/
                );
            }

            // Format Vertical Align
            if (format.verticalAlign && !metaOverrides.vAlignOverrides[rowIndex][colIndex]) {
                cell.format.verticalAlign = format.verticalAlign;
            }

            // Format Header
            cell.isHeader = false;
        });
    });
}

/**
 * Set the first column format borders for the table as well as header property
 * @param rows The rows of the table
 * @param format The table metadata format
 */
export function setFirstColumnFormatBorders(
    rows: ShallowMutableContentModelTableRow[],
    format: Partial<TableMetadataFormat>
) {
    const customStyles = format.hasFirstColumn ? format.firstColumnCustomStyles : undefined;

    rows.forEach((row, rowIndex) => {
        row.cells.forEach((readonlyCell, cellIndex) => {
            const cell = mutateBlock(readonlyCell);

            if (cellIndex === 0) {
                if (rowIndex == 0) {
                    cell.isHeader = !!format.hasHeaderRow;
                }

                if (format.hasFirstColumn && customStyles) {
                    cell.format.textAlign = customStyles.textAlign;
                    setBorderColor(cell.format, 'borderTop', customStyles.borderTopColor);
                    setBorderColor(cell.format, 'borderRight', customStyles.borderRightColor);
                    setBorderColor(cell.format, 'borderBottom', customStyles.borderBottomColor);
                    setBorderColor(cell.format, 'borderLeft', customStyles.borderLeftColor);
                    if (customStyles.backgroundColor) {
                        setTableCellBackgroundColor(
                            cell,
                            customStyles.backgroundColor,
                            false /*isColorOverride*/,
                            true /*applyToSegments*/
                        );
                    }
                }

                for (const block of cell.blocks) {
                    if (block.blockType == 'Paragraph') {
                        for (const segment of block.segments) {
                            mutateSegment(block, segment, cellSegment => {
                                if (format.hasFirstColumn && customStyles) {
                                    cellSegment.format.fontWeight = customStyles.fontWeight;
                                    cell.format.textAlign = customStyles.textAlign;
                                    cell.format.fontWeight = customStyles.fontWeight;
                                    cellSegment.format.italic = customStyles.italic;
                                } else if (
                                    cellSegment.format.fontWeight == 'bold' &&
                                    cell.format.fontWeight == 'bold'
                                ) {
                                    delete cellSegment.format.fontWeight;
                                    delete cell.format.fontWeight;
                                }
                            });
                        }
                    }
                }
            }
        });
    });
}

function setHeaderRowFormat(
    rows: ShallowMutableContentModelTableRow[],
    format: TableMetadataFormat,
    metaOverrides: MetaOverrides
) {
    if (!format.hasHeaderRow) {
        return;
    }

    const rowIndex = 0;
    const customStyles = format.headerRowCustomStyles;

    rows[rowIndex]?.cells.forEach((readonlyCell, cellIndex) => {
        const cell = mutateBlock(readonlyCell);

        cell.isHeader = true;
        cell.format.fontWeight = customStyles?.fontWeight ?? 'bold';

        if (format.headerRowColor) {
            if (!metaOverrides.bgColorOverrides[rowIndex][cellIndex]) {
                setTableCellBackgroundColor(
                    cell,
                    format.headerRowColor,
                    false /*isColorOverride*/,
                    true /*applyToSegments*/
                );
            }
            setBorderColor(
                cell.format,
                'borderTop',
                customStyles?.borderTopColor ?? format.headerRowColor
            );
            setBorderColor(
                cell.format,
                'borderRight',
                customStyles?.borderRightColor ?? format.headerRowColor
            );
            setBorderColor(
                cell.format,
                'borderLeft',
                customStyles?.borderLeftColor ?? format.headerRowColor
            );
        }

        if (customStyles) {
            cell.format.textAlign = customStyles.textAlign;
            setBorderColor(cell.format, 'borderBottom', customStyles.borderBottomColor);
            for (const block of cell.blocks) {
                if (block.blockType == 'Paragraph') {
                    for (const segment of block.segments) {
                        mutateSegment(block, segment, cellSegment => {
                            cellSegment.format.italic = customStyles.italic;
                        });
                    }
                }
            }
        }
    });
}

/**
 * @param format The cell format to set the border color
 * @param key The border key to set the color
 * @param value The color to set. If not given, it removes the color and sets the style to transparent
 */
function setBorderColor(format: BorderFormat, key: keyof BorderFormat, value?: string) {
    const border = extractBorderValues(format[key]);
    border.color = value || '';
    border.style = getBorderStyleFromColor(border.color);
    format[key] = combineBorderValue(border);
}

function getBorderStyleFromColor(color?: string): string {
    return !color || color == 'transparent' ? 'none' : 'solid';
}
