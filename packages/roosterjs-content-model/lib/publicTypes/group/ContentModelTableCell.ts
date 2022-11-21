import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelTableCellFormat } from '../format/ContentModelTableCellFormat';
import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';

/**
 * Content Model of Table Cell
 */
export interface ContentModelTableCell
    extends ContentModelBlockGroupBase<'TableCell'>,
        ContentModelWithFormat<ContentModelTableCellFormat>,
        ContentModelWithDataset<TableCellMetadataFormat> {
    /**
     * Whether this cell is spanned from left cell
     */
    spanLeft: boolean;

    /**
     * Whether this cell is spanned from above cell
     */
    spanAbove: boolean;

    /**
     * Whether this cell is a table header (TH) element
     */
    isHeader?: boolean;

    /**
     * Whether this cell is selected
     */
    isSelected?: boolean;
}
