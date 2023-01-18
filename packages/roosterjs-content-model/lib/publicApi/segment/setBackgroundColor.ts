import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set background color
 * @param editor The editor to operate on
 * @param backgroundColor The color to set. Pass null to remove existing color.
 */
export default function setBackgroundColor(
    editor: IExperimentalContentModelEditor,
    backgroundColor: string | null
) {
    formatSegmentWithContentModel(
        editor,
        'setBackgroundColor',
        backgroundColor
            ? format => {
                  format.backgroundColor = backgroundColor;
              }
            : format => {
                  delete format.backgroundColor;
              }
    );
}
