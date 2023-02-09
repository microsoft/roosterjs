import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set. Pass null to remove existing color.
 */
export default function setTextColor(editor: IContentModelEditor, textColor: string | null) {
    formatSegmentWithContentModel(
        editor,
        'setTextColor',
        textColor === null
            ? format => {
                  delete format.textColor;
              }
            : format => {
                  format.textColor = textColor;
              },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
