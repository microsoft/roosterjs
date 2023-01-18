import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set. Pass null to remove existing color.
 */
export default function setTextColor(
    editor: IExperimentalContentModelEditor,
    textColor: string | null
) {
    formatSegmentWithContentModel(
        editor,
        'setTextColor',
        textColor
            ? format => {
                  format.textColor = textColor;
              }
            : format => {
                  delete format.textColor;
              },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
