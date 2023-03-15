import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';
import { ContentModelTableCellFormat } from '../format/ContentModelTableCellFormat';
import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { Selectable } from '../selection/Selectable';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';

/**
 * Content Model of Table Cell
 */
export interface ContentModelTableCell
    extends ContentModelBlockGroupBase<'TableCell'>,
        ContentModelWithFormat<ContentModelTableCellFormat>,
        ContentModelWithDataset<TableCellMetadataFormat>,
        ContentModelBlockWithCache<HTMLTableCellElement>,
        Selectable {
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
}
