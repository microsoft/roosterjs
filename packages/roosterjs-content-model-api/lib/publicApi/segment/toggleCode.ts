import { createCodeDecorator } from 'roosterjs-content-model-dom';
import { formatSegmentWithContentModel } from '../utils/formatSegmentWithContentModel';
import type { IEditor, ReadonlyContentModelCodeFormat } from 'roosterjs-content-model-types';

const DefaultCodeFormat: ReadonlyContentModelCodeFormat = {
    fontFamily: 'monospace',
};

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export function toggleCode(editor: IEditor) {
    editor.focus();

    formatSegmentWithContentModel(
        editor,
        'toggleCode',
        (_, isTurningOn, segment) => {
            if (segment) {
                if (isTurningOn) {
                    segment.code = createCodeDecorator(DefaultCodeFormat);
                } else {
                    delete segment.code;
                }
            }
        },
        (_, segment) => !!segment?.code
    );
}
