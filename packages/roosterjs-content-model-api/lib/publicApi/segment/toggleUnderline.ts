import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { AnnouncingOption, IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle underline style
 * @param editor The editor to operate on
 */
export function toggleUnderline(editor: IEditor, options?: AnnouncingOption) {
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
        (format, segment) => !!format.underline || !!segment?.link?.format?.underline,
        false /*includingFormatHolder*/,
        (_model, isTurningOff, context) => {
            if (options?.announceFormatChange) {
                context.announceData = {
                    defaultStrings: isTurningOff ? 'announceUnderlineOff' : 'announceUnderlineOn',
                };
            }
        }
    );
}
