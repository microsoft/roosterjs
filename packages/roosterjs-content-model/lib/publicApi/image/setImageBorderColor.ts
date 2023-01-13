import formatImageWithContentModel from './formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setContentModelImageBorderColor } from '../../modelApi/image/setContentModelImageBorderColor';

/**
 * Set border color to an image
 * @param editor The editor instance
 * @param color of the border
 */
export default function setImageBorderColor(
    editor: IExperimentalContentModelEditor,
    color: string
) {
    formatImageWithContentModel(
        editor,
        (image: ContentModelImage) => {
            setContentModelImageBorderColor(image, color);
        },
        'setImageBorderColor'
    );
}
