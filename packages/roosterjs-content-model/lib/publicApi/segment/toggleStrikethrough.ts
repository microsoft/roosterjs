import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IExperimentalContentModelEditor) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        (segment, isTurningOn) => {
            segment.format.strikethrough = !!isTurningOn;
        },
        segment => !!segment.format.strikethrough
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
            formatApiName: 'toggleStrikethrough',
        }
    );
}
