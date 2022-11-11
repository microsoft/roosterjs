import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle superscript style
 * @param editor The editor to operate on
 */
export default function toggleSuperscript(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleSuperscript', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.superOrSubScriptSequence = isTurningOn ? 'super' : '';
            },
            segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'super'
        )
    );
}
