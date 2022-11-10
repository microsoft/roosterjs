import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export default function toggleSuperscript(editor: IExperimentalContentModelEditor) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        (segment, isTurningOn) => {
            segment.format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
        },
        segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'super'
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
            formatApiName: 'toggleSuperscript',
        }
    );
}
