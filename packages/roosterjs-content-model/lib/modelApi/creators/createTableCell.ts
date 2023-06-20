import { ContentModelTableCell, ContentModelTableCellFormat } from 'roosterjs-content-model-types';

/**
 * @internal
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
