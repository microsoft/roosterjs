import formatImageWithContentModel from './formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setContentModelImageBorderStyle } from '../../modelApi/image/setContentModelImageBorderStyle';

/**
 * Set border color to an image
 * @param editor The editor instance
 * @param style of the border
 */
export default function setImageBorderStyle(
    editor: IExperimentalContentModelEditor,
    style: string
) {
    formatImageWithContentModel(
        editor,
        (image: ContentModelImage) => {
            setContentModelImageBorderStyle(image, style);
        },
        'setImageBorderStyle'
    );
}
