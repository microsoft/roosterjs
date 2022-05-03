import { TableBorderFormat } from '../enum/TableBorderFormat';
import type { CompatibleTableBorderFormat } from '../compatibleEnum/TableBorderFormat';

/**
 * Table format
 */
export default interface TableFormat {
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
     * Table Borders Type
     */
    tableBorderFormat?: TableBorderFormat | CompatibleTableBorderFormat;
    /**
     * If true, the new format will not overlay cells that has color applied
     */
    keepCellShade?: boolean;
}
