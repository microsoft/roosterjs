import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
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

/**
 * Set text alignment of selected paragraphs
 * @param editor The editor to set alignment
 * @param alignment Alignment value: left, center or right
 */
export default function setAlignment(
    editor: IContentModelEditor,
    alignment: 'left' | 'center' | 'right'
) {
    formatParagraphWithContentModel(editor, 'setAlignment', para => {
        para.format.textAlign =
            ResultMap[alignment][para.format.direction == 'rtl' ? 'rtl' : 'ltr'];
    });
}
