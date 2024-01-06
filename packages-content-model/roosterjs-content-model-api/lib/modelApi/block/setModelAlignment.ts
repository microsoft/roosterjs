import { alignTable } from '../table/alignTable';
import { getOperationalBlocks } from 'roosterjs-content-model-core';
import type {
    ContentModelDocument,
    ContentModelListItem,
    TableAlignOperation,
} from 'roosterjs-content-model-types';

const ResultMap: Record<
    'left' | 'center' | 'right' | 'justify',
    Record<'ltr' | 'rtl', 'start' | 'center' | 'end' | 'justify'>
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
    justify: {
        ltr: 'justify',
        rtl: 'justify',
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
    alignment: 'left' | 'center' | 'right' | 'justify'
) {
    const paragraphOrListItemOrTable = getOperationalBlocks<ContentModelListItem>(
        model,
        ['ListItem'],
        ['TableCell']
    );

    paragraphOrListItemOrTable.forEach(({ block }) => {
        const newAlignment = ResultMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr'];
        if (block.blockType === 'Table' && alignment !== 'justify') {
            alignTable(
                block,
                TableAlignMap[alignment][block.format.direction == 'rtl' ? 'rtl' : 'ltr']
            );
        } else if (block) {
            if (block.blockType === 'BlockGroup' && block.blockGroupType === 'ListItem') {
                block.blocks.forEach(b => {
                    const { format } = b;
                    format.textAlign = newAlignment;
                });
            }
            const { format } = block;
            format.textAlign = newAlignment;
        }
    });

    return paragraphOrListItemOrTable.length > 0;
}
