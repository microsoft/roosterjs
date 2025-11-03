import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor } from 'roosterjs-content-model-types';

/**
 * Options for toggle italic API
 */
export interface ToggleItalicOptions {
    /**
     * Whether to announce the format change
     */
    announceFormatChange?: boolean;
}

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export function toggleItalic(editor: IEditor, options?: ToggleItalicOptions) {
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
