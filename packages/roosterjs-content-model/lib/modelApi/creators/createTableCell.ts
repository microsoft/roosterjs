import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';

/**
 * @internal
 */
export function createTableCell(
    colSpan: number,
    rowSpan: number,
    isHeader: boolean
): ContentModelTableCell {
    return {
        blockType: ContentModelBlockType.BlockGroup,
        blockGroupType: ContentModelBlockGroupType.TableCell,
        blocks: [],
        format: {},
        spanLeft: colSpan > 1,
        spanAbove: rowSpan > 1,
        isHeader,
    };
}
