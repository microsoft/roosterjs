import { alignTable } from '../table/alignTable';
import { ContentModelDocument } from '../../publicTypes/group/ContentModelDocument';
import { ContentModelListItem } from '../../publicTypes/group/ContentModelListItem';
import { getOperationalBlocks } from '../selection/collectSelections';
import { isBlockGroupOfType } from '../common/isBlockGroupOfType';
import { TableOperation } from 'roosterjs-editor-types';

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

const TableAlignMap: Record<
    'left' | 'center' | 'right',
    Record<
        'ltr' | 'rtl',
        TableOperation.AlignLeft | TableOperation.AlignCenter | TableOperation.AlignRight
    >
> = {
    left: {
        ltr: TableOperation.AlignLeft,
        rtl: TableOperation.AlignRight,
    },
    center: {
        ltr: TableOperation.AlignCenter,
        rtl: TableOperation.AlignCenter,
    },
    right: {
        ltr: TableOperation.AlignRight,
        rtl: TableOperation.AlignLeft,
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
        []
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        if (isBlockGroupOfType<ContentModelListItem>(block, 'ListItem')) {
            block.formatHolder.format.textAlign =
                ResultMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr'];
            block.levels[0].display = 'flex';
        } else if (block.blockType === 'Table') {
            alignTable(
                block,
                TableAlignMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr']
            );
        } else if (block) {
            const { format } = block;
            format.textAlign = ResultMap[alignment][format.direction == 'rtl' ? 'rtl' : 'ltr'];
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}
