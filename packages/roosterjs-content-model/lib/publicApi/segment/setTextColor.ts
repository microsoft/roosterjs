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
            ? (format, _, segment) => {
                  delete format.textColor;

                  if (segment?.link) {
                      delete segment.link.format.textColor;
                  }
              }
            : (format, _, segment) => {
                  format.textColor = textColor;

                  if (segment?.link) {
                      segment.link.format.textColor = textColor;
                  }
              },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
