import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set font size
 * @param editor The editor to operate on
 * @param fontSize The font size to set
 */
export default function setFontSize(editor: IExperimentalContentModelEditor, fontSize: string) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        segment => {
            segment.format.fontSize = fontSize;
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
            formatApiName: 'setFontSize',
        }
    );
}
