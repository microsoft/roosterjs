import { formatWithContentModel } from '../utils/formatWithContentModel';
import { IExperimentalContentModelEditor } from '../../publicTypes/IExperimentalContentModelEditor';
import { setSegmentStyle } from '../../modelApi/segment/setSegmentStyle';

/**
 * Toggle subscript style
 * @param editor The editor to operate on
 */
export default function toggleSubscript(editor: IExperimentalContentModelEditor) {
    formatWithContentModel(editor, 'toggleSubscript', model =>
        setSegmentStyle(
            model,
            (segment, isTurningOn) => {
                segment.format.superOrSubScriptSequence = isTurningOn ? 'sub' : '';
            },
            segment => segment.format.superOrSubScriptSequence?.split(' ').pop() == 'sub'
        )
    );
}
