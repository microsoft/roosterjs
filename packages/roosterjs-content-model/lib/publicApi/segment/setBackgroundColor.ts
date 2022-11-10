import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set background color
 * @param editor The editor to operate on
 * @param backgroundColor The color to set
 */
export default function setBackgroundColor(
    editor: IExperimentalContentModelEditor,
    backgroundColor: string
) {
    const model = editor.createContentModel();

    setSegmentStyle(model, segment => {
        segment.format.backgroundColor = backgroundColor;
    });

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
            formatApiName: 'setBackgroundColor',
        }
    );
}
