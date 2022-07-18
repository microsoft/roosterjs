import { ContentModelBlockGroupType } from '../../publicTypes/enum/BlockGroupType';
import { ContentModelBlockType } from '../../publicTypes/enum/BlockType';
import { ContentModelTableCell } from '../../publicTypes/block/group/ContentModelTableCell';
import { tempCreateAttributes } from './tempCreateAttributes';

/**
 * @internal
 */
export function createTableCell(
    colSpan: number,
    rowSpan: number,
    isHeader: boolean,
    tempTd: HTMLTableCellElement | null
): ContentModelTableCell {
    return {
        blockGroupType: ContentModelBlockGroupType.TableCell,
        blockType: ContentModelBlockType.BlockGroup,
        blocks: [],
        spanLeft: colSpan > 0,
        spanAbove: rowSpan > 0,
        isHeader,
        tempAttributes: tempCreateAttributes(tempTd),
    };
}
