import { formatWithContentModel } from '../utils/formatWithContentModel';
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
    formatWithContentModel(editor, 'setBackgroundColor', model =>
        setSegmentStyle(model, segment => {
            segment.format.backgroundColor = backgroundColor;
        })
    );
}
