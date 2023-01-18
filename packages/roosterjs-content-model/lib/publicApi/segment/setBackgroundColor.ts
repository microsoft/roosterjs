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
        backgroundColor === null
            ? format => {
                  delete format.backgroundColor;
              }
            : format => {
                  format.backgroundColor = backgroundColor;
              }
    );
}
