import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';

const ResultMap: Record<
    'left' | 'center' | 'right',
    Record<'ltr' | 'rtl', 'start' | 'center' | 'end'>
> = {
    left: {
        ltr: 'start',
        rtl: 'end',
    },
    center: {
        ltr: 'center',
        rtl: 'center',
    },
    right: {
        ltr: 'end',
        rtl: 'start',
    },
};

/**
 * @internal
 */
export function setModelAlignment(
    model: ContentModelDocument,
    alignment: 'left' | 'center' | 'right'
) {
    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            block.formatHolder.format.alignSelf =
                ResultMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr'];
            block.levels.forEach(level => {
                level.flexDirection = 'column';
                level.display = 'flex';
            });
        } else if (block.blockType === 'Table') {
            const isWholeTableSelected = block?.cells.every(row =>
                row.every(cell => cell.isSelected)
            );
            if (isWholeTableSelected) {
                alignTable(block, alignment, block.format.direction == 'rtl');
            }
        } else if (block) {
            const { format } = block;
            format.textAlign = ResultMap[alignment][format.direction == 'rtl' ? 'rtl' : 'ltr'];
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}

function alignTable(
    table: ContentModelTable,
    alignment: 'left' | 'center' | 'right',
    isRTL: boolean
) {
    switch (alignment) {
        case 'center':
            table.format.marginLeft = 'auto';
            table.format.marginRight = 'auto';
            break;
        case 'right':
            table.format.marginLeft = isRTL ? '' : 'auto';
            table.format.marginRight = isRTL ? 'auto' : '';
            break;
        default:
            table.format.marginLeft = isRTL ? 'auto' : '';
            table.format.marginRight = isRTL ? '' : 'auto';
    }
}
