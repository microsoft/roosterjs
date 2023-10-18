import { alignTable } from '../table/alignTable';
import { getOperationalBlocks } from '../selection/collectSelections';
import type { TableAlignOperation } from '../../publicTypes/parameter/TableOperation';
import type { ContentModelDocument, ContentModelListItem } from 'roosterjs-content-model-types';

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
    Record<'ltr' | 'rtl', TableAlignOperation>
> = {
    left: {
        ltr: 'alignLeft',
        rtl: 'alignRight',
    },
    center: {
        ltr: 'alignCenter',
        rtl: 'alignCenter',
    },
    right: {
        ltr: 'alignRight',
        rtl: 'alignLeft',
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
        const newAligment = ResultMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr'];
        if (block.blockType === 'Table') {
            alignTable(
                block,
                TableAlignMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr']
            );
        } else if (block) {
            const { format } = block;
            format.textAlign = newAligment;
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}
