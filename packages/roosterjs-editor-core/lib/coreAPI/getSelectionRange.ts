import EditorCore, { GetSelectionRange } from '../editor/EditorCore';
import { contains } from 'roosterjs-editor-dom';

const getSelectionRange: GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => {
    let result: Range = null;

    if (!tryGetFromCache || core.api.hasFocus(core)) {
        let selection = core.document.defaultView.getSelection();
        if (selection && selection.rangeCount > 0) {
            let range = selection.getRangeAt(0);
            if (contains(core.contentDiv, range)) {
                result = range;
            }
        }
    }

    if (!result && tryGetFromCache) {
        result = core.cachedSelectionRange;
    }

    return result;
};

export default getSelectionRange;
