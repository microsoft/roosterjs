import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';

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
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.TableCell,
        blocks: [],
        format: format ? { ...format } : {},
        spanLeft,
        spanAbove,
        isHeader: !!isHeader,
    };
}
