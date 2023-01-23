import formatImageBorderWithContentModel from './formatImageBorderWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image border color for all selected images at selection.
 * @param editor The editor instance
 * @param color The image border color
 */
export default function setImageBorderColor(
    editor: IExperimentalContentModelEditor,
    color: string
) {
    formatImageBorderWithContentModel(editor, segment => {
        segment.format.borderColor = color;
    });
}
