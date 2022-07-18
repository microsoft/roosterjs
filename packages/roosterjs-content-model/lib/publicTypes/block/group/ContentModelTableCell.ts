import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../enum/BlockGroupType';
import type { CompatibleContentModelBlockGroupType } from '../../compatibleEnum/BlockGroupType';

/**
 * Content Model of Table Cell
 */
export interface ContentModelTableCell
    extends ContentModelBlockGroupBase<
        ContentModelBlockGroupType.TableCell | CompatibleContentModelBlockGroupType.TableCell
    > {
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
    isSelected?: Boolean;

    /**
     * @deprecated Temporary used only
     */
    tempAttributes: Record<string, string>;
}
