import { ContentModelTableCell, ContentModelTableCellFormat } from 'roosterjs-content-model-types';

/**
 * Create a ContentModelTableCell model
 * @param spanLeftOrColSpan @optional Whether this is a table cell merged with its left cell, or colspan number @default false
 * @param spanAboveOrRowSpan Whether this is a table cell merged with its upper cell, or rowSpan number @default false
 * @param isHeader @optional Whether this is a header cell @default false
 * @param format @optional The format of this model
 */
export function createTableCell(
    spanLeftOrColSpan?: boolean | number,
    spanAboveOrRowSpan?: boolean | number,
    isHeader?: boolean,
    format?: ContentModelTableCellFormat
): ContentModelTableCell {
    const spanLeft =
        typeof spanLeftOrColSpan === 'number' ? spanLeftOrColSpan > 1 : !!spanLeftOrColSpan;
    const spanAbove =
        typeof spanAboveOrRowSpan === 'number' ? spanAboveOrRowSpan > 1 : !!spanAboveOrRowSpan;
    return {
        blockGroupType: 'TableCell',
        blocks: [],
        format: format ? { ...format } : {},
        spanLeft,
        spanAbove,
        isHeader: !!isHeader,
        dataset: {},
    };
}
