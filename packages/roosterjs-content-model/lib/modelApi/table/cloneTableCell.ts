import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';

/**
 * @internal
 */
export function cloneTableCell(cell: ContentModelTableCell): ContentModelTableCell {
    const newCell: ContentModelTableCell = {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.TableCell,
        blocks: [],
        spanLeft: cell.spanLeft,
        spanAbove: cell.spanAbove,
        isHeader: false,
        format: { ...cell.format },
    };

    return newCell;
}
