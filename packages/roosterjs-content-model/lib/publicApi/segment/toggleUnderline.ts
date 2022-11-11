import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle underline style
 * @param editor The editor to operate on
 */
export default function toggleUnderline(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleUnderline', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.underline = !!isTurningOn;
            },
            segment => !!segment.format.underline
        )
    );
}
