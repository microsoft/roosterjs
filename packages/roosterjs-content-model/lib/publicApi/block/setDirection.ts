import { formatParagraphWithContentModel } from '../utils/formatParagraphWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set text direction of selected paragraphs (Left to right or Right to left)
 * @param editor The editor to set alignment
 * @param direction Direction value: ltr (Left to right) or rtl (Right to left)
 */
export default function setDirection(editor: IContentModelEditor, direction: 'ltr' | 'rtl') {
    formatParagraphWithContentModel(editor, 'setDirection', para => {
        const isOldValueRtl = para.format.direction == 'rtl';
        const isNewValueRtl = direction == 'rtl';

        if (isOldValueRtl != isNewValueRtl) {
            para.format.direction = direction;

            // Adjust margin when change direction
            // TODO: make margin and padding direction-aware, like what we did for textAlign. So no need to adjust them here
            // TODO: Do we also need to handle border here?
            const marginLeft = para.format.marginLeft;
            const paddingLeft = para.format.paddingLeft;

            para.format.marginLeft = para.format.marginRight;
            para.format.marginRight = marginLeft;

            para.format.paddingLeft = para.format.paddingRight;
            para.format.paddingRight = paddingLeft;
        }
    });
}
