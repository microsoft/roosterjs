import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleItalic(editor: IExperimentalContentModelEditor) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        (segment, isTurningOn) => {
            segment.format.italic = !!isTurningOn;
        },
        segment => !!segment.format.italic
    );

    editor.addUndoSnapshot(
        () => {
            editor.focus();
            if (model) {
                editor.setContentModel(model);
            }
        },
        ChangeSource.Format,
        false /*canUndoByBackspace*/,
        {
            formatApiName: 'toggleItalic',
        }
    );
}
