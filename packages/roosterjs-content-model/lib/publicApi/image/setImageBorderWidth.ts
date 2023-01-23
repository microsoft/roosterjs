import formatImageBorderWithContentModel from './formatImageBorderWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image border width for all selected images at selection.
 * @param editor The editor instance
 * @param width The image border width
 * @param isPt if the image unit is in points, if false, the image will be set in pixels
 */
export default function setImageBorderWidth(
    editor: IExperimentalContentModelEditor,
    width: string,
    isPt?: boolean
) {
    formatImageBorderWithContentModel(editor, segment => {
        segment.format.borderWidth = isPt ? calculateBorderWidth(width) : width;
    });
}

function calculateBorderWidth(borderWidth: string): string {
    const width = parseInt(borderWidth);
    const pxWidth = width * (72 / 96);
    return pxWidth + 'px';
}
