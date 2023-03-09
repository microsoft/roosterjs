import { FormatState } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from '../../modelApi/format/pendingFormat';
import { IContentModelEditor } from '../../publicTypes/IContentModelEditor';
import { retrieveModelFormatState } from '../../modelApi/common/retrieveModelFormatState';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(editor: IContentModelEditor): FormatState {
    let result: FormatState = {
        ...editor.getUndoState(),

        isDarkMode: editor.isDarkMode(),
        zoomScale: editor.getZoomScale(),
    };

    formatWithContentModel(
        editor,
        'getFormatState',
        model => {
            const pendingFormat = getPendingFormat(editor);

            retrieveModelFormatState(model, pendingFormat, result);

            return false;
        },
        {
            useReducedModel: true,
        }
    );

    return result;
}
