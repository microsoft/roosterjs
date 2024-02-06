import { addCode } from 'roosterjs-content-model-dom';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { ContentModelCode, IStandaloneEditor } from 'roosterjs-content-model-types';

const DefaultCode: ContentModelCode = {
    format: {
        fontFamily: 'monospace',
    },
};

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleCode(editor: IStandaloneEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleCode',
        (_, isTurningOn, segment) => {
            if (segment) {
                if (isTurningOn) {
                    addCode(segment, DefaultCode);
                } else {
                    delete segment.code;
                }
            }
        },
        (_, segment) => !!segment?.code
    );
}
