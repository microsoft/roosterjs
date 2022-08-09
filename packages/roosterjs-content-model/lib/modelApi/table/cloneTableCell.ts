import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { ContentModelTableCellFormat } from '../../publicTypes/format/ContentModelTableCellFormat';

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
        format: cloneFormat(cell.format),
    };

    return newCell;
}

function cloneFormat(format: ContentModelTableCellFormat): ContentModelTableCellFormat {
    return {
        ...format,
        borderColor: format.borderColor ? [...format.borderColor] : undefined,
        borderWidth: format.borderWidth ? [...format.borderWidth] : undefined,
        borderStyle: format.borderStyle ? [...format.borderStyle] : undefined,
        metadata: format.metadata ? { ...format.metadata } : undefined,
    };
}
