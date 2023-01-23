import formatImageBorderWithContentModel from './formatImageBorderWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set image border style for all selected images at selection.
 * @param editor The editor instance
 * @param style The image border style
 */
export default function setImageBorderStyle(
    editor: IExperimentalContentModelEditor,
    style: string
) {
    formatImageBorderWithContentModel(editor, segment => {
        segment.format.borderStyle = style;
    });
}
