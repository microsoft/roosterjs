import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle underline style
 * @param editor The editor to operate on
 */
export default function toggleUnderline(editor: IStandaloneEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleUnderline',
        (format, isTurningOn, segment) => {
            format.underline = !!isTurningOn;

            if (segment?.link) {
                segment.link.format.underline = !!isTurningOn;
            }
        },
        (format, segment) => !!format.underline || !!segment?.link?.format?.underline
    );
}
