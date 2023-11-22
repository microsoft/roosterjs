import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { isBold } from 'roosterjs-content-model-core';
import type { IStandaloneEditor } from 'roosterjs-content-model-types';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export default function toggleBold(editor: IStandaloneEditor) {
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
            )
    );
}
