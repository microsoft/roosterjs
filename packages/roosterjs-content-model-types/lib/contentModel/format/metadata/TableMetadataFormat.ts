import type { TableSpecialCellMetadataFormat } from './TableSpecialCellMetadataFormat';

/**
 * Format of table that stored as metadata
 */
export type TableMetadataFormat = {
    /**
     * Top border color for each row
     */
    topBorderColor?: string | null;

    /**
     * Bottom border color for each row
     */
    bottomBorderColor?: string | null;

    /**
     * Vertical border color for each row
     */
    verticalBorderColor?: string | null;

    /**
     * Set header row
     */
    hasHeaderRow?: boolean;

    /**
     * Header row background color for even cells
     */
    headerRowColor?: string | null;

    /**
     * Custom styles for the header row cells (font weight, font style, border colors).
     * Only applied when hasHeaderRow is true.
     */
    headerRowCustomStyles?: TableSpecialCellMetadataFormat | null;

    /**
     * Set first column
     */
    hasFirstColumn?: boolean;

    /**
     * Custom styles for the first column cells (font weight, font style, border colors).
     * Only applied when hasFirstColumn is true.
     */
    firstColumnCustomStyles?: TableSpecialCellMetadataFormat | null;

    /**
     * Set banded columns
     */
    hasBandedColumns?: boolean;

    /**
     * Set banded rows
     */
    hasBandedRows?: boolean;

    /**
     * Background color for even row or even columns
     */
    bgColorEven?: string | null;

    /**
     * Background color for odd row or odd columns
     */
    bgColorOdd?: string | null;

    /**
     * Table Borders Type. Use value of constant TableBorderFormat as value
     */
    tableBorderFormat?: number;

    /**
     * Vertical alignment for each row
     */
    verticalAlign?: 'top' | 'middle' | 'bottom' | null;
};
