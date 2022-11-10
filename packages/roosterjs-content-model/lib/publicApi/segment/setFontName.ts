import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Set font name
 * @param editor The editor to operate on
 * @param fontName The font name to set
 */
export default function setFontName(editor: IExperimentalContentModelEditor, fontName: string) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        segment => {
            segment.format.fontFamily = fontName;
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
            formatApiName: 'setFontName',
        }
    );
}
