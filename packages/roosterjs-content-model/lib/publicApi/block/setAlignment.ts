import { ContentModelTable } from '../../publicTypes/block/ContentModelTable';
import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getFirstSelectedTable } from '../../modelApi/selection/collectSelections';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
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

function alignTable(table: ContentModelTable, alignment: 'left' | 'center' | 'right') {
    switch (alignment) {
        case 'center':
            table.format.marginLeft = 'auto';
            table.format.marginRight = 'auto';
            break;
        case 'right':
            table.format.marginLeft = 'auto';
            table.format.marginRight = '';
            break;
        default:
            table.format.marginLeft = '';
            table.format.marginRight = 'auto';
    }
}

/**
 * Set text alignment of selected paragraphs
 * @param editor The editor to set alignment
 * @param alignment Alignment value: left, center or right
 */
export default function setAlignment(
    editor: IContentModelEditor,
    alignment: 'left' | 'center' | 'right'
) {
    let isWholeTableSelected = undefined;
    formatWithContentModel(editor, 'setAlignment', model => {
        const tableModel = getFirstSelectedTable(model);
        isWholeTableSelected = tableModel?.cells.every(row => row.every(cell => cell.isSelected));
        if (tableModel && isWholeTableSelected) {
            alignTable(tableModel, alignment);
        }
        return !!isWholeTableSelected;
    });

    if (!isWholeTableSelected) {
        formatParagraphWithContentModel(editor, 'setAlignment', para => {
            para.format.textAlign =
                ResultMap[alignment][para.format.direction == 'rtl' ? 'rtl' : 'ltr'];
        });
    }
}
