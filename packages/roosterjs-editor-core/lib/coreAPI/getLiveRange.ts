import EditorCore from '../editor/EditorCore';
import isRangeInContainer from '../utils/isRangeInContainer';

export default function getLiveRange(core: EditorCore): Range {
    let selection = core.document.defaultView.getSelection();
    if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        if (isRangeInContainer(range, core.contentDiv)) {
            return range;
        }
    }

    return null;
}
