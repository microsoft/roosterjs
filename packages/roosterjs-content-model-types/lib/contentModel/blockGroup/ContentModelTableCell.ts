import type { TableCellMetadataFormat } from '../format/metadata/TableCellMetadataFormat';
import type {
    ContentModelBlockGroupBase,
    MutableContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelTableCellFormat } from '../format/ContentModelTableCellFormat';
import type {
    ContentModelWithDataset,
    ReadonlyContentModelWithDataset,
} from '../format/ContentModelWithDataset';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';
import type { ReadonlySelectable, Selectable } from '../common/Selectable';

/**
 * Common part of Content Model of Table Cell
 */
export interface ContentModelTableCellCommon {
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

/**
 * Content Model of Table Cell
 */
export interface ContentModelTableCell
    extends Selectable,
        ContentModelTableCellCommon,
        ContentModelBlockGroupBase<'TableCell', HTMLTableCellElement>,
        ContentModelWithFormat<ContentModelTableCellFormat>,
        ContentModelWithDataset<TableCellMetadataFormat> {}

/**
 * Content Model of Table Cell (Readonly)
 */
export interface ReadonlyContentModelTableCell
    extends ReadonlySelectable,
        Readonly<ContentModelTableCellCommon>,
        ReadonlyContentModelBlockGroupBase<'TableCell', HTMLTableCellElement>,
        ReadonlyContentModelWithFormat<ContentModelTableCellFormat>,
        ReadonlyContentModelWithDataset<TableCellMetadataFormat> {}

/**
 * Content Model of Table Cell (Single level mutable)
 */
export interface MutableContentModelTableCell
    extends Selectable,
        ContentModelTableCellCommon,
        MutableContentModelBlockGroupBase<'TableCell', HTMLTableCellElement>,
        ContentModelWithFormat<ContentModelTableCellFormat>,
        ContentModelWithDataset<TableCellMetadataFormat> {}
