import { ChangeSource } from 'roosterjs-editor-types';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle bold style
 * @param editor The editor to operate on
 */
export default function toggleBold(editor: IExperimentalContentModelEditor) {
    const model = editor.createContentModel();

    setSegmentStyle(
        model,
        (segment, isTurningOn) => {
            segment.format.fontWeight = isTurningOn ? 'bold' : undefined;
        },
        segment => isBold(segment.format.fontWeight)
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
            formatApiName: 'toggleBold',
        }
    );
}

function isBold(boldStyle?: string): boolean {
    return (
        !!boldStyle && (boldStyle == 'bold' || boldStyle == 'bolder' || parseInt(boldStyle) >= 600)
    );
}
