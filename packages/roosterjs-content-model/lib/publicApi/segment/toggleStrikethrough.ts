import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle strikethrough style
 * @param editor The editor to operate on
 */
export default function toggleStrikethrough(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleStrikethrough', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.strikethrough = !!isTurningOn;
            },
            segment => !!segment.format.strikethrough
        )
    );
}
