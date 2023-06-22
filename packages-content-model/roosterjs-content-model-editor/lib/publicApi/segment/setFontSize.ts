import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

/**
 * Set font size
 * @param editor The editor to operate on
 * @param fontSize The font size to set
 */
export default function setFontSize(editor: IContentModelEditor, fontSize: string) {
    formatSegmentWithContentModel(
        editor,
        'setFontSize',
        format => {
            format.fontSize = fontSize;
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
    );
}
