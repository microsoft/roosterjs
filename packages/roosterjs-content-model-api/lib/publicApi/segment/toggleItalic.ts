import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { AnnouncingOption, IEditor } from 'roosterjs-content-model-types';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export function toggleItalic(editor: IEditor, options?: AnnouncingOption) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleItalic',
        (format, isTurningOn) => {
            format.italic = !!isTurningOn;
        },
        format => !!format.italic,
        undefined /* includingFormatHolder */,
        (_model, isTurningOff, context) => {
            if (options?.announceFormatChange) {
                context.announceData = {
                    defaultStrings: isTurningOff ? 'announceItalicOff' : 'announceItalicOn',
                };
            }
        }
    );
}
