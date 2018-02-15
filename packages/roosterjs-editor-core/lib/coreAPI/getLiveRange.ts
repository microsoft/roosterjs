import EditorCore from '../editor/EditorCore';
import getSelection from './getSelection';
import isRangeInContainer from '../utils/isRangeInContainer';

export default function getLiveRange(core: EditorCore): Range {
    let selection = getSelection(core);
    if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        if (isRangeInContainer(range, core.contentDiv)) {
            return range;
        }
    }

    return null;
}
