import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IExperimentalContentModelEditor) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        (segment, isTurningOn) => {
            segment.format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
        },
        segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
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
            formatApiName: 'toggleSubscript',
        }
    );
}
