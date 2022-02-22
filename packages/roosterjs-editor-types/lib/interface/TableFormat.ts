import ModeIndependentColor from './ModeIndependentColor';
import { TableBorderFormat } from '../enum/TableBorderFormat';

/**
 * Table format
 */
export default interface TableFormat {
    /**
     * Top border color for each row
     */
    topBorderColor: string | null;
    /**
     * Bottom border color for each row
     */
    bottomBorderColor: string | null;
    /**
     * Vertical border color for each row
     */
    verticalBorderColor: string | null;
    /**
     * Set header row
     */
    hasHeaderRow: boolean;
    /**
     * Header row background color for even cells
     */
    headerRowColor: string | ModeIndependentColor | null;
    /**
     * Set first column
     */
    hasFirstColumn: boolean;
    /**
     * Set banded columns
     */
    hasBandedColumns: boolean;
    /**
     * Set banded rows
     */
    hasBandedRows: boolean;
    /**
     * Background color for even row or even columns
     */
    bgColorEven: string | ModeIndependentColor | null;
    /**
     * Background color for odd row or odd columns
     */
    bgColorOdd: string | ModeIndependentColor | null;
    /**
     * Table Borders Type
     */
    tableBorderFormat: TableBorderFormat;
}
