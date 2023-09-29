import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelBlockWithCache } from '../block/ContentModelBlockWithCache';
import type { ContentModelTableCellFormat } from '../format/ContentModelTableCellFormat';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import type { Selectable } from '../selection/Selectable';
import type { TableCellMetadataFormat } from 'roosterjs-editor-types';

/**
 * Content Model of Table Cell
 */
export interface ContentModelTableCell
    extends Selectable,
        ContentModelBlockGroupBase<'TableCell'>,
        ContentModelWithFormat<ContentModelTableCellFormat>,
        ContentModelWithDataset<TableCellMetadataFormat>,
        ContentModelBlockWithCache<HTMLTableCellElement> {
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
