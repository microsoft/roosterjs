import formatImageWithContentModel from './formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setContentModelImageBoxShadow } from 'roosterjs-content-model/lib/modelApi/image/setContentModelImageBoxShadow';

/**
 * Set border color to an image
 * @param editor The editor instance
 * @param color of the border
 */
export default function setImageBoxShadow(editor: IExperimentalContentModelEditor, color: string) {
    formatImageWithContentModel(
        editor,
        (image: ContentModelImage) => {
            setContentModelImageBoxShadow(image, color);
        },
        'setImageBoxShadow'
    );
}
