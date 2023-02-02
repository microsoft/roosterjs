import { FormatState } from 'roosterjs-editor-types';
import { formatWithContentModel } from '../utils/formatWithContentModel';
import { getPendingFormat } from './pendingFormat';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { reducedModelChildProcessor } from '../../domToModel/processors/reducedModelChildProcessor';
import { retrieveModelFormatState } from '../../modelApi/common/retrieveModelFormatState';

/**
 * Get current format state
 * @param editor The editor to get format from
 */
export default function getFormatState(editor: IExperimentalContentModelEditor): FormatState {
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
            processorOverride: {
                // Create a "reduced" Content Model that only scan a sub DOM tree that contains the selection.
                child: reducedModelChildProcessor,
            },
        }
    );

    return result;
}
