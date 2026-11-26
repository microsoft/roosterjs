import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set. Pass null to remove existing color.
 */
export function setTextColor(editor: IEditor, textColor: string | null) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'setTextColor',
        textColor === null
            ? (format, _, segment) => {
                  delete format.textColor;
                  if (format.textFillColor) {
                      format.textFillColor = 'currentcolor';
                  }

                  if (segment?.link) {
                      delete segment.link.format.textColor;
                      if (segment.link.format.textFillColor) {
                          segment.link.format.textFillColor = 'currentcolor';
                      }
                  }
              }
            : (format, _, segment) => {
                  format.textColor = textColor;
                  if (format.textFillColor) {
                      format.textFillColor = 'currentcolor';
                  }

                  if (segment?.link) {
                      segment.link.format.textColor = textColor;
                      if (segment.link.format.textFillColor) {
                          segment.link.format.textFillColor = 'currentcolor';
                      }
                  }
              },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
