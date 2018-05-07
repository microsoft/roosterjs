import EditorCore, { GetLiveRange } from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

const getLiveRange: GetLiveRange = (core: EditorCore) => {
    let selection = core.document.defaultView.getSelection();
    if (selection && selection.rangeCount > 0) {
        let range = selection.getRangeAt(0);
        if (contains(core.contentDiv, range)) {
            return range;
        }
    }

    return null;
};

export default getLiveRange;
