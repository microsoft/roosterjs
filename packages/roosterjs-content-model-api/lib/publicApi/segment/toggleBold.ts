import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { isBold } from 'roosterjs-content-model-dom';
import type { AnnouncingOption, IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export function toggleBold(editor: IEditor, options?: AnnouncingOption) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleBold',
        (format, isTurningOn) => {
            format.fontWeight = isTurningOn ? 'bold' : 'normal';
        },
        (format, _, paragraph) =>
            isBold(
                typeof format.fontWeight == 'undefined'
                    ? paragraph?.decorator?.format.fontWeight
                    : format.fontWeight
            ),
        undefined /* includeFormatHolder */,
        (_model, isTurningOff, context) => {
            if (options?.announceFormatChange) {
                context.announceData = {
                    defaultStrings: isTurningOff ? 'announceBoldOff' : 'announceBoldOn',
                };
            }
        }
    );
}
