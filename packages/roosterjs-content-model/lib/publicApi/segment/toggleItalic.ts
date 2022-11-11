import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle italic style
 * @param editor The editor to operate on
 */
export default function toggleItalic(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleItalic', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.italic = !!isTurningOn;
            },
            segment => !!segment.format.italic
        )
    );
}
