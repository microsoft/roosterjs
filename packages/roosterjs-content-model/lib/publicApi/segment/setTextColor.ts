import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set text color
 * @param editor The editor to operate on
 * @param textColor The text color to set
 */
export default function setTextColor(editor: IExperimentalContentModelEditor, textColor: string) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        segment => {
            segment.format.textColor = textColor;
        },
        undefined /* segmentHasStyleCallback*/,
        true /*includingFormatHandler*/
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
            formatApiName: 'setTextColor',
        }
    );
}
