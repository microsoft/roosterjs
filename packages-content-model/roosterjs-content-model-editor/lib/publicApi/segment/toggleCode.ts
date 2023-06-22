import { addCode } from 'roosterjs-content-model-dom';
import { ContentModelCode } from 'roosterjs-content-model-types';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';

const DefaultCode: ContentModelCode = {
    format: {
        fontFamily: 'monospace',
    },
};

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleCode(editor: IContentModelEditor) {
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
