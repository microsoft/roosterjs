import formatImageWithContentModel from './formatImageWithContentModel';
import { ContentModelImage } from '../../publicTypes/segment/ContentModelImage';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setContentModelImageBorderWidth } from '../../modelApi/image/setContentModelImageBorderWidth';

/**
 * Set border width to an image (only supports width in px or pts)
 * @param editor The editor instance
 * @param width of the border
 * @param isPt if this value is points, if undefined the border width will be considered in px
 */
export default function setImageBorderWidth(
    editor: IExperimentalContentModelEditor,
    width: string,
    isPt: boolean = true
) {
    formatImageWithContentModel(
        editor,
        (image: ContentModelImage) => {
            setContentModelImageBorderWidth(image, width, isPt);
        },
        'setImageBorderWidth'
    );
}
