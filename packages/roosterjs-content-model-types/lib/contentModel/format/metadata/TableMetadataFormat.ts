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
     * Set first column
     */
    hasFirstColumn?: boolean;

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
